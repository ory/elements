import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, 'setup-pnpm.mjs');
const repositoryManifest = process.env.SETUP_PNPM_TEST_MANIFEST ?? path.resolve(here, '../../../package.json');
const packageManager = JSON.parse(readFileSync(repositoryManifest, 'utf8')).packageManager;
const version = packageManager.slice('pnpm@'.length, packageManager.indexOf('+'));
const flipped = packageManager.replace(/sha512\.(.)/, (_, digit) => `sha512.${digit === '0' ? '1' : '0'}`);

let scratch;
let npmCache;

before(() => {
  scratch = mkdtempSync(path.join(tmpdir(), 'setup-pnpm-test-'));
  npmCache = path.join(scratch, 'npm-cache');
});

after(() => {
  rmSync(scratch, { recursive: true, force: true });
});

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function newJob(name) {
  const job = path.join(scratch, name);
  const workspace = path.join(job, 'workspace');
  const runnerTemp = path.join(job, 'runner-temp');
  const home = path.join(job, 'home');
  for (const dir of [workspace, runnerTemp, home]) {
    mkdirSync(dir, { recursive: true });
  }
  const files = {
    GITHUB_ENV: path.join(job, 'env'),
    GITHUB_PATH: path.join(job, 'path'),
    GITHUB_OUTPUT: path.join(job, 'output'),
  };
  for (const file of Object.values(files)) {
    writeFileSync(file, '');
  }
  return { workspace, runnerTemp, home, files };
}

function writeManifest(dir, manifest) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'package.json'), JSON.stringify(manifest));
}

function runSetup(job, { project = '.', cache, extraEnv = {} } = {}) {
  const env = {
    ...process.env,
    GITHUB_WORKSPACE: job.workspace,
    RUNNER_TEMP: job.runnerTemp,
    HOME: job.home,
    npm_config_cache: npmCache,
    SETUP_PNPM_PROJECT: project,
    ...job.files,
    ...extraEnv,
  };
  if (cache != null) {
    env.SETUP_PNPM_CACHE = cache;
  }
  return spawnSync(process.execPath, [script], { env, encoding: 'utf8' });
}

function exportedEnv(job, earlierPath = []) {
  const env = Object.fromEntries(
    readFileSync(job.files.GITHUB_ENV, 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split(/=(.*)/s, 2)),
  );
  const added = readFileSync(job.files.GITHUB_PATH, 'utf8').trim().split('\n').reverse();
  return { ...process.env, ...env, PATH: [...added, ...earlierPath, process.env.PATH].join(path.delimiter) };
}

function pnpmVersion(cwd, env) {
  const result = spawnSync('pnpm', ['--version'], { cwd, env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

describe('rejects a packageManager that Corepack cannot verify', () => {
  const cases = {
    'no hash': { packageManager: packageManager.slice(0, packageManager.indexOf('+')) },
    'a sha256 hash': { packageManager: packageManager.replace(/\+sha512\.[0-9a-f]+$/, `+sha256.${'a'.repeat(64)}`) },
    'another package manager': { packageManager: 'yarn@4.5.0+sha512.' + 'a'.repeat(128) },
    'no packageManager field': {},
  };
  for (const [name, manifest] of Object.entries(cases)) {
    test(name, () => {
      const job = newJob(`reject-${name.replaceAll(' ', '-')}`);
      writeManifest(job.workspace, manifest);
      const result = runSetup(job);
      assert.equal(result.status, 1);
      assert.match(result.stdout, /^::error file=package\.json::packageManager must pin pnpm with a sha512 integrity hash/m);
      assert.equal(readFileSync(job.files.GITHUB_ENV, 'utf8'), '');
      assert.equal(readFileSync(job.files.GITHUB_PATH, 'utf8'), '');
    });
  }

  test('a missing package.json', () => {
    const job = newJob('reject-missing-manifest');
    const result = runSetup(job, { project: 'absent' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error file=absent\/package\.json::Cannot read /m);
  });

  test('a package.json that is not valid JSON', () => {
    const job = newJob('reject-invalid-manifest');
    writeFileSync(path.join(job.workspace, 'package.json'), '{"packageManager":\njunk');
    const result = runSetup(job);
    assert.equal(result.status, 1);
    const lines = result.stdout.split('\n').filter((line) => line !== '');
    assert.equal(lines.length, 1, result.stdout);
    assert.match(lines[0], /^::error file=package\.json::Cannot read /);
    assert.match(lines[0], /%0A/);
  });

  test('a missing package.json in a directory whose name needs escaping', () => {
    const job = newJob('reject-escaped-file');
    const result = runSetup(job, { project: 'a,b:c' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error file=a%2Cb%3Ac\/package\.json::Cannot read /m);
  });

  test('a cache lockfile with a line break', () => {
    const job = newJob('reject-multiline-lockfile');
    writeManifest(job.workspace, { packageManager });
    const result = runSetup(job, { extraEnv: { SETUP_PNPM_CACHE_LOCKFILE: 'pnpm-lock.yaml\nkratos/pnpm-lock.yaml' } });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error::cache-lockfile must be a single path or glob, but contains a line break\.$/m);
    for (const file of Object.values(job.files)) {
      assert.equal(readFileSync(file, 'utf8'), '');
    }
  });

  test('a project with a line break', () => {
    const job = newJob('reject-multiline-project');
    writeManifest(job.workspace, { packageManager });
    const result = runSetup(job, { project: 'app\nnested' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error::project must be a single path, but contains a line break\.$/m);
    for (const file of Object.values(job.files)) {
      assert.equal(readFileSync(file, 'utf8'), '');
    }
  });

  test('an unknown cache mode', () => {
    const job = newJob('reject-cache-mode');
    writeManifest(job.workspace, { packageManager });
    const result = runSetup(job, { cache: 'full' });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error::cache must be none, restore or save, but is "full"\./m);
  });

  test('a missing RUNNER_TEMP', () => {
    const job = newJob('reject-missing-env');
    writeManifest(job.workspace, { packageManager });
    const result = runSetup(job, { extraEnv: { RUNNER_TEMP: '' } });
    assert.equal(result.status, 1);
    assert.match(result.stdout, /^::error::RUNNER_TEMP is not set\./m);
  });

  test('a RUNNER_TEMP that does not exist', () => {
    const job = newJob('reject-absent-runner-temp');
    writeManifest(job.workspace, { packageManager });
    const result = runSetup(job, { extraEnv: { RUNNER_TEMP: path.join(job.runnerTemp, 'does-not-exist') } });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /^::error::ENOENT: no such file or directory, mkdtemp /m);
    assert.equal(readFileSync(job.files.GITHUB_ENV, 'utf8'), '');
  });
});

describe('installs the declared pnpm', () => {
  let job;
  let fakePnpm;

  before(() => {
    job = newJob('verified');
    writeManifest(path.join(job.workspace, 'app'), { name: 'app', private: true, packageManager });
    writeManifest(path.join(job.workspace, 'app', 'nested'), { name: 'nested', private: true });
    fakePnpm = path.join(job.home, 'preinstalled');
    mkdirSync(fakePnpm);
    writeFileSync(path.join(fakePnpm, 'pnpm'), '#!/bin/sh\necho 0.0.0\n', { mode: 0o755 });
    writeFileSync(path.join(job.home, 'setup-node.npmrc'), '//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}\nregistry=https://registry.npmjs.org/\nalways-auth=true\n');
  });

  test('verifies the hash and exports the environment', () => {
    const result = runSetup(job, {
      project: './app/',
      cache: 'save',
      extraEnv: {
        PATH: [fakePnpm, process.env.PATH].join(path.delimiter),
        NPM_CONFIG_USERCONFIG: path.join(job.home, 'setup-node.npmrc'),
        NODE_AUTH_TOKEN: 'XXXXX-XXXXX-XXXXX-XXXXX',
      },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    const outputs = readFileSync(job.files.GITHUB_OUTPUT, 'utf8');
    assert.match(outputs, new RegExp(`^version=${escape(version)}$`, 'm'));
    assert.match(outputs, new RegExp(`^store-path=${escape(job.home)}/\\.local/share/pnpm/store/v\\d+$`, 'm'));
    assert.match(outputs, /^store-layout=v\d+$/m);
    assert.match(outputs, /^lockfile=app\/pnpm-lock\.yaml$/m);
    const env = readFileSync(job.files.GITHUB_ENV, 'utf8');
    assert.match(env, new RegExp(`^COREPACK_HOME=${escape(job.runnerTemp)}/setup-pnpm-[^/]+/corepack-home$`, 'm'));
    assert.match(env, /^COREPACK_ENABLE_DOWNLOAD_PROMPT=0$/m);
    assert.match(env, new RegExp(`^PNPM_HOME=${escape(job.home)}/\\.local/share/pnpm$`, 'm'));
    assert.match(readFileSync(job.files.GITHUB_PATH, 'utf8'), new RegExp(`^${escape(job.home)}/\\.local/share/pnpm/bin\\n${escape(job.runnerTemp)}/setup-pnpm-[^/]+/bin\\n$`));
  });

  test('resolves the declared version in the project, below it, and where no manifest is in reach', () => {
    const env = exportedEnv(job, [fakePnpm]);
    assert.equal(pnpmVersion(path.join(job.workspace, 'app'), env), version);
    assert.equal(pnpmVersion(path.join(job.workspace, 'app', 'nested'), env), version);
    assert.equal(pnpmVersion(job.runnerTemp, env), version);
  });

  test('checks the hash of another pnpm version that a directory declares', () => {
    assert.match(readFileSync(job.files.GITHUB_PATH, 'utf8'), /setup-pnpm-[^/]+\/bin\n$/);
    const other = path.join(job.workspace, 'other');
    writeManifest(other, { name: 'other', private: true, packageManager: `pnpm@10.34.5+sha512.${'0'.repeat(128)}` });
    const result = spawnSync('pnpm', ['--version'], { cwd: other, env: exportedEnv(job), encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /Mismatch hashes/);
  });

  test('passes an explicit cache lockfile through', () => {
    const second = newJob('explicit-lockfile');
    writeManifest(second.workspace, { name: 'root', private: true, packageManager });
    const result = runSetup(second, { cache: 'restore', extraEnv: { SETUP_PNPM_CACHE_LOCKFILE: 'kratos/**/pnpm-lock.yaml' } });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(readFileSync(second.files.GITHUB_OUTPUT, 'utf8'), /^lockfile=kratos\/\*\*\/pnpm-lock\.yaml$/m);
  });

  test('still rejects a wrong hash for the same version later in the job', () => {
    writeManifest(path.join(job.workspace, 'tampered'), { name: 'tampered', private: true, packageManager: flipped });
    const result = runSetup(job, { project: 'tampered', extraEnv: { COREPACK_HOME: exportedEnv(job).COREPACK_HOME } });
    assert.equal(result.status, 1);
    assert.match(result.stdout + result.stderr, /Mismatch hashes/);
  });
});

test('rejects a wrong hash with an empty Corepack cache', () => {
  const job = newJob('wrong-hash');
  writeManifest(job.workspace, { name: 'wrong', private: true, packageManager: flipped });
  const result = runSetup(job);
  assert.equal(result.status, 1);
  assert.match(result.stdout + result.stderr, /Mismatch hashes/);
  assert.match(result.stdout, /^::error file=package\.json::/m);
  assert.equal(readFileSync(job.files.GITHUB_PATH, 'utf8'), '');
});
