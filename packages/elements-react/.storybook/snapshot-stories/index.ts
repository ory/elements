// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import fs from "node:fs"
import path from "node:path"
import type { Indexer } from "storybook/internal/types"
import type { Plugin } from "vite"
import { NOT_ADOPTED } from "./not-adopted"
import {
  describeSnapshot,
  flowFromSnapshot,
  type GeneratedStory,
  type SnapshotBody,
  type SnapshotFlow,
} from "./naming"

const PACKAGE_ROOT = path.resolve(__dirname, "../..")
const SNAPSHOT_DIR = path.join(PACKAGE_ROOT, ".stub-responses")
const STORY_DIR = path.join(PACKAGE_ROOT, "stories")

const THEME_MODULE = path.join(PACKAGE_ROOT, "src/theme/default")
const CONFIG_MODULE = path.join(STORY_DIR, "utils")

const COMPONENTS: Record<Exclude<SnapshotFlow, "error">, string> = {
  login: "Login",
  registration: "Registration",
  settings: "Settings",
  recovery: "Recovery",
  verification: "Verification",
}

const PARSERS: Record<Exclude<SnapshotFlow, "error">, string> = {
  login: "LoginFlowFromJSON",
  registration: "RegistrationFlowFromJSON",
  settings: "SettingsFlowFromJSON",
  recovery: "RecoveryFlowFromJSON",
  verification: "VerificationFlowFromJSON",
}

/** Deliberately narrow, so the indexer cannot claim a hand-written story file. */
const SNAPSHOT_TEST = /[/\\]\.stub-responses[/\\].+\.json$/

function listFiles(directory: string, matches: (file: string) => boolean) {
  const found: string[] = []
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const child = path.join(current, entry.name)
      if (entry.isDirectory()) {
        walk(child)
      } else if (matches(child)) {
        found.push(child)
      }
    }
  }
  walk(directory)
  return found
}

/**
 * Snapshots a hand-written story borrows to demonstrate something other than
 * the screen itself, so the reference does not count as owning it.
 */
const BORROWED = new Set([
  // The card-header customisation story renders a verification flow to have
  // something on screen; "Verification → Code → Show Form" still needs its own.
  "verification/code/initial-form.json",
])

/**
 * Snapshots a hand-written story already renders. Generating a story for one of
 * these would show the same screen twice under two ids, so they are skipped.
 * The scan is what makes the hand-written stories authoritative: move a story
 * out of `stories/` and its snapshot starts generating on the next start.
 */
function ownedByHandWrittenStory(): Set<string> {
  const referenced = new Set<string>()
  for (const file of listFiles(STORY_DIR, (f) => /\.stories\.tsx?$/.test(f))) {
    const source = fs.readFileSync(file, "utf8")
    for (const match of source.matchAll(/\$snapshots\/([^"'`]+\.json)/g)) {
      if (!BORROWED.has(match[1])) {
        referenced.add(match[1])
      }
    }
  }
  return referenced
}

/**
 * The snapshot's path relative to `.stub-responses`, whether it arrives
 * absolute (from Vite) or relative to the working directory (from Storybook).
 */
function snapshotKey(file: string): string | null {
  const match = /[/\\]\.stub-responses[/\\](.+\.json)$/.exec(file)
  return match ? match[1].split(path.sep).join("/") : null
}

let cache: Map<string, GeneratedStory> | undefined

/**
 * Every snapshot that becomes a story, keyed by its path under
 * `.stub-responses`.
 *
 * Computed once per process: `storybook dev` needs a restart to pick up a
 * snapshot that was added or claimed by a hand-written story.
 */
export function generatedStories(): Map<string, GeneratedStory> {
  if (cache) {
    return cache
  }

  const owned = ownedByHandWrittenStory()
  const stories = new Map<string, GeneratedStory>()

  for (const file of listFiles(SNAPSHOT_DIR, (f) => f.endsWith(".json"))) {
    const snapshot = path.relative(SNAPSHOT_DIR, file).split(path.sep).join("/")
    if (NOT_ADOPTED.has(snapshot) || owned.has(snapshot)) {
      continue
    }
    const parsed = readSnapshot(file, snapshot)
    if (!parsed) {
      continue
    }
    const flow = flowFromSnapshot(parsed)
    if (!flow) {
      skipped(
        snapshot,
        `it is neither a self-service flow ("ui.action") nor an error the theme can render ("error.message"). Add it to NOT_ADOPTED if it is not meant to become a story.`,
      )
      continue
    }
    stories.set(snapshot, describeSnapshot(snapshot, flow))
  }

  cache = stories
  return stories
}

function storyFor(file: string): GeneratedStory | undefined {
  const key = snapshotKey(file)
  return key ? generatedStories().get(key) : undefined
}

/**
 * A snapshot that generates no story simply does not appear in the sidebar, so
 * the reason has to be said out loud.
 */
function skipped(snapshot: string, reason: string) {
  console.warn(`[snapshot-stories] no story for ${snapshot}: ${reason}`)
}

function readSnapshot(file: string, snapshot: string): SnapshotBody | null {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as SnapshotBody
  } catch (error) {
    skipped(snapshot, `it is not valid JSON: ${String(error)}`)
    return null
  }
}

/** Turns a snapshot into a single-story CSF module. */
function renderModule(story: GeneratedStory, raw: string): string {
  if (story.flow === "error") {
    return renderErrorModule(story, raw)
  }

  const component = COMPONENTS[story.flow]
  const parser = PARSERS[story.flow]

  return `import { ${parser} } from "@ory/client-fetch"
import { ${component} } from ${JSON.stringify(THEME_MODULE)}
import { config } from ${JSON.stringify(CONFIG_MODULE)}

export default {
  title: ${JSON.stringify(story.title)},
  component: ${component},
  parameters: { layout: ${JSON.stringify(story.layout)} },
}

export const ${story.exportName} = {
  name: ${JSON.stringify(story.name)},
  parameters: { __id: ${JSON.stringify(story.id)} },
  args: {
    flow: ${parser}(JSON.parse(${JSON.stringify(raw)})),
    config,
  },
}
`
}

/**
 * The error screen stamps the time of rendering into the report it asks the
 * user to copy, so the story pins the clock the way the hand-written error
 * story does. Without it every Chromatic run sees a different screen.
 */
const ERROR_SCREEN_DATE = "new Date(Date.UTC(2025, 1, 1))"

/** Turns an error snapshot into the screen the theme shows instead of a flow. */
function renderErrorModule(story: GeneratedStory, raw: string): string {
  return `import { Error } from ${JSON.stringify(THEME_MODULE)}
import { config, ErrorGenericFromJSON } from ${JSON.stringify(CONFIG_MODULE)}

export default {
  title: ${JSON.stringify(story.title)},
  component: Error,
  parameters: { layout: ${JSON.stringify(story.layout)} },
}

export const ${story.exportName} = {
  name: ${JSON.stringify(story.name)},
  parameters: {
    __id: ${JSON.stringify(story.id)},
    date: ${ERROR_SCREEN_DATE},
  },
  args: {
    error: ErrorGenericFromJSON(JSON.parse(${JSON.stringify(raw)})),
    config,
  },
}
`
}

export const snapshotIndexer: Indexer = {
  test: SNAPSHOT_TEST,
  createIndex: async (fileName) => {
    const story = storyFor(fileName)
    if (!story) {
      return []
    }
    return [
      {
        type: "story",
        importPath: fileName,
        exportName: story.exportName,
        name: story.name,
        title: story.title,
        __id: story.id,
      },
    ]
  },
}

/**
 * Resolves the snapshots the indexer claimed to a virtual module holding their
 * generated CSF. The virtual id drops the `.json` extension so Vite's own JSON
 * plugin leaves the generated JavaScript alone; snapshots the indexer did not
 * claim are not intercepted at all and still load as JSON, which is what the
 * hand-written stories `require()`.
 */
const VIRTUAL_PREFIX = "\0ory-snapshot-story:"

export function snapshotStoriesPlugin(): Plugin {
  return {
    name: "ory-snapshot-stories",
    enforce: "pre",
    resolveId(source, importer) {
      // A story file asking for a snapshot wants the flow itself, not a story
      // built from it — `stories/customized/input.stories.ts` renders a
      // verification flow that is also a generated story in its own right.
      if (importer?.startsWith(STORY_DIR + path.sep)) {
        return null
      }
      const key = snapshotKey(source.split("?")[0])
      if (!key || !generatedStories().has(key)) {
        return null
      }
      return VIRTUAL_PREFIX + key.replace(/\.json$/, "")
    },
    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null
      }
      const key = `${id.slice(VIRTUAL_PREFIX.length)}.json`
      const story = generatedStories().get(key)
      if (!story) {
        return null
      }
      return renderModule(
        story,
        fs.readFileSync(path.join(SNAPSHOT_DIR, key), "utf8"),
      )
    },
  }
}
