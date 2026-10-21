#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const COREPACK_PACKAGE = 'corepack@0.36.0';
const PACKAGE_MANAGER = /^pnpm@(\d+\.\d+\.\d+)\+sha512\.[0-9a-f]{128}$/;
const CACHE_MODES = new Set(['none', 'restore', 'save']);

class SetupError extends Error {
  constructor(message, file) {
    super(message);
    this.file = file;
  }
}

function readPackageManager(manifestPath) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    throw new SetupError(`Cannot read ${manifestPath}: ${err.message}`, manifestPath);
  }
  const spec = manifest?.packageManager;
  const match = typeof spec === 'string' ? PACKAGE_MANAGER.exec(spec) : null;
  if (match == null) {
    throw new SetupError(`packageManager must pin pnpm with a sha512 integrity hash, as pnpm@<version>+sha512.<128 hex digits>, but is ${JSON.stringify(spec ?? null)}.`, manifestPath);
  }
  return { spec, version: match[1] };
}

function requireEnv(env, name) {
  const value = env[name];
  if (value == null || value === '') {
    throw new SetupError(`${name} is not set.`);
  }
  return value;
}

function run(command, args, { cwd, env, capture = false, file }) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });
  if (result.error != null) {
    throw new SetupError(`Could not run ${command}: ${result.error.message}`, file);
  }
  if (result.status !== 0) {
    throw new SetupError(`${command} ${args.join(' ')} exited with ${result.status ?? result.signal}.`, file);
  }
  return capture ? result.stdout.trim() : '';
}

function setupPnpm(env) {
  const workspace = requireEnv(env, 'GITHUB_WORKSPACE');
  const runnerTemp = requireEnv(env, 'RUNNER_TEMP');
  const home = requireEnv(env, 'HOME');
  const envFile = requireEnv(env, 'GITHUB_ENV');
  const pathFile = requireEnv(env, 'GITHUB_PATH');
  const outputFile = requireEnv(env, 'GITHUB_OUTPUT');
  const cache = env.SETUP_PNPM_CACHE || 'none';
  if (!CACHE_MODES.has(cache)) {
    throw new SetupError(`cache must be none, restore or save, but is ${JSON.stringify(cache)}.`);
  }
  if (/[\r\n]/.test(env.SETUP_PNPM_CACHE_LOCKFILE ?? '')) {
    throw new SetupError('cache-lockfile must be a single path or glob, but contains a line break.');
  }
  if (/[\r\n]/.test(env.SETUP_PNPM_PROJECT ?? '')) {
    throw new SetupError('project must be a single path, but contains a line break.');
  }
  const project = path.resolve(workspace, env.SETUP_PNPM_PROJECT || '.');
  const lockfile = env.SETUP_PNPM_CACHE_LOCKFILE || path.relative(workspace, path.join(project, 'pnpm-lock.yaml')).split(path.sep).join('/');
  const manifestPath = path.join(project, 'package.json');
  const { spec, version } = readPackageManager(manifestPath);

  const root = mkdtempSync(path.join(runnerTemp, 'setup-pnpm-'));
  const corepackPrefix = path.join(root, 'corepack');
  const binDir = path.join(root, 'bin');
  // Corepack checks the integrity hash only when it downloads a version, so every run starts with an empty Corepack cache.
  const corepackHome = path.join(root, 'corepack-home');
  const pnpmHome = path.join(home, '.local', 'share', 'pnpm');
  mkdirSync(corepackPrefix);
  mkdirSync(binDir);
  mkdirSync(corepackHome);

  run('npm', ['install', '--prefix', corepackPrefix, '--no-save', '--no-package-lock', '--no-audit', '--no-fund', '--ignore-scripts', COREPACK_PACKAGE], { cwd: root, env });
  const corepack = path.join(corepackPrefix, 'node_modules', '.bin', 'corepack');

  const exported = {
    COREPACK_HOME: corepackHome,
    COREPACK_ENABLE_DOWNLOAD_PROMPT: '0',
    PNPM_HOME: pnpmHome,
  };
  const childEnv = {
    ...env,
    ...exported,
    PATH: [binDir, path.join(pnpmHome, 'bin'), env.PATH].join(path.delimiter),
  };
  run(corepack, ['install', '-g', spec], { cwd: project, env: childEnv, file: manifestPath });
  run(corepack, ['enable', 'pnpm', '--install-directory', binDir], { cwd: project, env: childEnv });

  const reported = run('pnpm', ['--version'], { cwd: project, env: childEnv, capture: true });
  if (reported !== version) {
    throw new SetupError(`pnpm reports ${JSON.stringify(reported)}, but packageManager declares ${version}.`, manifestPath);
  }

  const storePath = run('pnpm', ['store', 'path', '--silent'], { cwd: project, env: childEnv, capture: true });

  appendFileSync(
    envFile,
    Object.entries(exported)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(''),
  );
  appendFileSync(pathFile, `${path.join(pnpmHome, 'bin')}\n${binDir}\n`);
  const outputs = { version, 'store-path': storePath, 'store-layout': path.basename(storePath), lockfile };
  appendFileSync(
    outputFile,
    Object.entries(outputs)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(''),
  );
  return outputs;
}

function annotationPath(file, workspace) {
  const relative = workspace == null ? file : path.relative(workspace, file);
  return relative.startsWith('..') || path.isAbsolute(relative) ? file : relative;
}

function escapeData(text) {
  return String(text).replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A');
}

function escapeProperty(text) {
  return escapeData(text).replaceAll(':', '%3A').replaceAll(',', '%2C');
}

try {
  setupPnpm(process.env);
} catch (err) {
  if (!(err instanceof SetupError)) {
    console.log(`::error::${escapeData(err.message)}`);
    throw err;
  }
  const file = err.file == null ? '' : ` file=${escapeProperty(annotationPath(err.file, process.env.GITHUB_WORKSPACE))}`;
  console.log(`::error${file}::${escapeData(err.message)}`);
  process.exitCode = 1;
}
