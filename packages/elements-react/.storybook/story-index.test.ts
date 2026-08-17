/**
 * @jest-environment node
 */
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import fs from "node:fs"
import path from "node:path"
import { buildIndex } from "storybook/internal/core-server"
import storyIds from "./story-ids.json"

const FIXTURE = path.join(__dirname, "story-ids.json")

/**
 * Story ids are the keys Chromatic files its baselines under, so a story that
 * changes id silently loses its history. `story-ids.json` lists every id
 * Storybook currently produces — adding, removing or renaming a story has to
 * show up as a diff there and be approved together with the Chromatic run.
 *
 * Regenerate with `UPDATE_STORY_IDS=1 pnpm exec nx run @ory/elements-react:test`.
 */
test("every story keeps the id its Chromatic baseline is filed under", async () => {
  const index = await buildIndex({
    configDir: __dirname,
    disableTelemetry: true,
  })
  const ids = Object.keys(index.entries).sort()

  if (process.env.UPDATE_STORY_IDS) {
    fs.writeFileSync(FIXTURE, `${JSON.stringify(ids, null, 2)}\n`)
    return
  }

  expect(ids).toEqual(storyIds)
}, 120_000)
