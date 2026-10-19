/**
 * @jest-environment node
 */
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from "fs"
import { join } from "path"
import { packageRootOf } from "../../scripts/agent-docs"
import {
  readManifest,
  renderCompatibility,
  withCompatibility,
} from "../../scripts/compatibility"

const packageRoot = packageRootOf(__filename)

const manifest = {
  name: "@ory/example",
  ory: { oel: ">=26.3" },
  dependencies: { "@ory/client-fetch": "^1.22.65", cookie: "^1.0.1" },
  peerDependencies: { react: "^19.0.0", next: ">=15.0.0" },
}

test("should list the minimum OEL release and the Ory, React, and framework ranges", () => {
  const section = renderCompatibility(manifest)

  expect(section).toContain(
    "works with Ory Network and with the Ory Enterprise License (OEL) 26.3 or later.",
  )
  expect(section).toContain("- `next`: `>=15.0.0`\n- `react`: `^19.0.0`")
  expect(section).toContain("- `@ory/client-fetch`: `^1.22.65`")
  expect(section).not.toContain("cookie")
})

test("should leave out the peer dependency list when there are no peers", () => {
  expect(
    renderCompatibility({ ...manifest, peerDependencies: undefined }),
  ).not.toContain("installs these packages")
})

test.each([undefined, {}, { oel: "26.3" }, { oel: ">=26" }])(
  "should require the minimum OEL release in package.json, got %j",
  (ory) => {
    expect(() => renderCompatibility({ ...manifest, ory })).toThrow(
      '"ory": { "oel": ">=YY.Q" }',
    )
  },
)

test("should replace only the generated section of a guide", async () => {
  const guide = [
    "# Guide",
    "",
    "Intro.",
    "",
    "<!-- compatibility:start -->",
    "",
    "stale",
    "",
    "<!-- compatibility:end -->",
    "",
    "## Next",
    "",
  ].join("\n")

  const updated = await withCompatibility(guide, manifest)

  expect(updated).toMatch(/^# Guide\n\nIntro\.\n\n<!-- compatibility:start -->/)
  expect(updated).toMatch(/<!-- compatibility:end -->\n\n## Next\n$/)
  expect(updated).not.toContain("stale")
  expect(updated).toContain("## Compatibility")
})

test("should require the markers of the generated section", async () => {
  await expect(withCompatibility("# Guide\n", manifest)).rejects.toThrow(
    "<!-- compatibility:start -->",
  )
})

test("should ship an agents/GUIDE.md that matches package.json. Run `pnpm exec nx run @ory/elements-react:compatibility` and commit the result.", async () => {
  const guide = readFileSync(join(packageRoot, "agents/GUIDE.md"), "utf8")

  expect(guide).toBe(await withCompatibility(guide, readManifest(packageRoot)))
})
