// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  assertReleased,
  distTag,
  nextPrereleaseVersion,
  releaseCommit,
  releaseNotes,
  releaseTag,
  stableRelease,
  unpublishedDependencies,
} from "./release-plan.ts"

describe("assertReleased", () => {
  it("accepts a version that is on npm", () => {
    assert.doesNotThrow(() =>
      assertReleased("@ory/elements-react", "1.2.1", ["1.2.0", "1.2.1"]),
    )
  })

  it("accepts a package that was never versioned", () => {
    assert.doesNotThrow(() => assertReleased("@ory/ssr", "0.0.0", []))
  })

  it("rejects a version that is not on npm", () => {
    assert.throws(
      () => assertReleased("@ory/elements-react", "1.2.2", ["1.2.1"]),
      /@ory\/elements-react@1\.2\.2 is not on npm/,
    )
    assert.throws(
      () => assertReleased("@ory/ssr", "0.0.0-unused", []),
      /@ory\/ssr@0\.0\.0-unused is not on npm/,
    )
  })
})

describe("stableRelease", () => {
  it("publishes a committed version that is not on npm", () => {
    assert.deepEqual(stableRelease("@ory/nextjs", "1.0.0", ["1.0.0-rc.1"]), {
      version: "1.0.0",
      distTag: "latest",
      gitTag: "release/@ory/nextjs/v1.0.0",
      alreadyPublished: false,
    })
  })

  it("keeps a published version so missing tags and releases are retried", () => {
    assert.deepEqual(stableRelease("@ory/elements-react", "1.2.1", ["1.2.1"]), {
      version: "1.2.1",
      distTag: "latest",
      gitTag: "release/@ory/elements-react/v1.2.1",
      alreadyPublished: true,
    })
  })

  it("skips a package that was never versioned", () => {
    assert.equal(stableRelease("@ory/ssr", "0.0.0", []), null)
  })

  it("skips a prerelease that is already on npm", () => {
    assert.equal(
      stableRelease("@ory/nextjs", "1.0.0-rc.1", ["1.0.0-rc.1"]),
      null,
    )
  })

  it("refuses a prerelease that is not on npm", () => {
    assert.throws(
      () => stableRelease("@ory/ssr", "0.0.0-unused", []),
      /@ory\/ssr@0\.0\.0-unused is a prerelease/,
    )
  })
})

describe("releaseCommit", () => {
  it("returns the commit that set the version", () => {
    assert.equal(
      releaseCommit(
        [
          { sha: "c", version: "1.2.2" },
          { sha: "b", version: "1.2.1" },
          { sha: "a", version: "1.2.0" },
        ],
        "1.2.2",
      ),
      "c",
    )
  })

  it("skips later commits that keep the version", () => {
    assert.equal(
      releaseCommit(
        [
          { sha: "d", version: "1.2.2" },
          { sha: "c", version: "1.2.2" },
          { sha: "b", version: "1.2.1" },
        ],
        "1.2.2",
      ),
      "c",
    )
  })

  it("returns the latest commit that set a version set before", () => {
    assert.equal(
      releaseCommit(
        [
          { sha: "d", version: "1.2.2" },
          { sha: "c", version: "1.2.1" },
          { sha: "b", version: "1.2.2" },
          { sha: "a", version: "1.2.1" },
        ],
        "1.2.2",
      ),
      "d",
    )
  })

  it("returns the commit that created the manifest", () => {
    assert.equal(releaseCommit([{ sha: "a", version: "0.1.0" }], "0.1.0"), "a")
  })

  it("rejects a version the latest commit does not have", () => {
    assert.throws(
      () =>
        releaseCommit(
          [
            { sha: "b", version: "1.2.1" },
            { sha: "a", version: "1.2.2" },
          ],
          "1.2.2",
        ),
      /1\.2\.2 is not the version at b/,
    )
    assert.throws(() => releaseCommit([], "1.2.2"), /no commits/)
  })
})

describe("releaseNotes", () => {
  const changelog = [
    "# @ory/nextjs",
    "",
    "## 1.0.0",
    "",
    "### Major Changes",
    "",
    "- abc1234: Ship it.",
    "",
    "## 1.0.0-rc.1 (2026-02-03)",
    "",
    "### Fixes",
    "",
    "- Older.",
    "",
  ].join("\n")

  it("returns the section for the version", () => {
    assert.equal(
      releaseNotes(changelog, "1.0.0"),
      "### Major Changes\n\n- abc1234: Ship it.",
    )
  })

  it("finds headings that carry a date", () => {
    assert.equal(releaseNotes(changelog, "1.0.0-rc.1"), "### Fixes\n\n- Older.")
  })

  it("does not match a longer version with the same prefix", () => {
    assert.equal(releaseNotes(changelog, "1.0.0-rc"), "")
  })

  it("returns nothing when the version has no section", () => {
    assert.equal(releaseNotes(changelog, "2.0.0"), "")
  })
})

describe("nextPrereleaseVersion", () => {
  it("keeps the computed version when it is free", () => {
    assert.equal(nextPrereleaseVersion("1.3.0-rc.0", ["1.2.1"]), "1.3.0-rc.0")
  })

  it("continues after the highest published prerelease of that version", () => {
    assert.equal(
      nextPrereleaseVersion("1.3.0-rc.0", [
        "1.2.1",
        "1.3.0-rc.0",
        "1.3.0-rc.3",
      ]),
      "1.3.0-rc.4",
    )
  })

  it("does not count prereleases of other versions or identifiers", () => {
    assert.equal(
      nextPrereleaseVersion("1.3.0-rc.0", ["1.4.0-rc.5", "1.3.0-next.9"]),
      "1.3.0-rc.0",
    )
  })
})

describe("distTag", () => {
  it("never publishes a prerelease to latest", () => {
    assert.equal(distTag("1.0.0"), "latest")
    assert.equal(distTag("0.1.0"), "latest")
    assert.equal(distTag("1.0.0-rc.1"), "next")
  })
})

describe("releaseTag", () => {
  it("uses one format for every package", () => {
    assert.equal(
      releaseTag("@ory/nextjs", "1.0.0"),
      "release/@ory/nextjs/v1.0.0",
    )
  })
})

describe("unpublishedDependencies", () => {
  const nextjs = {
    name: "@ory/nextjs",
    version: "1.0.0",
    dependencies: {
      "@ory/ssr": "workspace:^",
      "@ory/client-fetch": "^1.22.65",
    },
  }

  it("fails when a workspace dependency is neither released nor on npm", () => {
    assert.deepEqual(
      unpublishedDependencies([nextjs], { "@ory/ssr": "0.0.0" }, {}),
      [
        "@ory/nextjs@1.0.0 depends on @ory/ssr@0.0.0, which is not on npm and not part of this release.",
      ],
    )
  })

  it("accepts a workspace dependency released alongside", () => {
    assert.deepEqual(
      unpublishedDependencies(
        [nextjs, { name: "@ory/ssr", version: "0.1.0" }],
        { "@ory/ssr": "0.1.0" },
        {},
      ),
      [],
    )
  })

  it("accepts a workspace dependency that is already on npm", () => {
    assert.deepEqual(
      unpublishedDependencies(
        [nextjs],
        { "@ory/ssr": "0.1.0" },
        { "@ory/ssr": ["0.1.0"] },
      ),
      [],
    )
  })

  it("ignores development dependencies", () => {
    assert.deepEqual(
      unpublishedDependencies(
        [
          {
            name: "@ory/elements-react",
            version: "1.3.0",
            devDependencies: { "@ory/ssr": "workspace:^" },
          },
        ],
        { "@ory/ssr": "0.0.0" },
        {},
      ),
      [],
    )
  })
})
