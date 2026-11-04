// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { describe, it } from "node:test"
import {
  apiReportChange,
  type BumpRequirement,
  changesetBumps,
  gateFailures,
  requiredBump,
  slotsChange,
} from "./changeset-gate.ts"

const fixture = (name: string) =>
  readFileSync(new URL(`fixtures/${name}`, import.meta.url), "utf8")

type Slots = { slots: { path: string; description: string }[] }
const baseSlots = JSON.parse(fixture("slots-base.json")) as Slots

describe("apiReportChange", () => {
  it("ignores changes to extractor warnings", () => {
    assert.equal(apiReportChange(fixture("api-comment-only.diff")), "none")
  })

  it("treats an added member as additive", () => {
    assert.equal(apiReportChange(fixture("api-added-member.diff")), "additive")
  })

  it("treats moved warnings and new imports next to additions as additive", () => {
    assert.equal(
      apiReportChange(fixture("api-added-with-moved-warnings.diff")),
      "additive",
    )
  })

  it("treats a changed signature as breaking", () => {
    assert.equal(
      apiReportChange(fixture("api-changed-signature.diff")),
      "breaking",
    )
  })

  it("treats a changed property type as breaking", () => {
    assert.equal(apiReportChange(fixture("api-changed-type.diff")), "breaking")
  })

  it("treats the first report of a new package as additive", () => {
    assert.equal(apiReportChange(fixture("api-new-package.diff")), "additive")
  })

  it("ignores a line that only moved", () => {
    const diff = [
      "--- a/packages/nextjs/api-report/nextjs.api.md",
      "+++ b/packages/nextjs/api-report/nextjs.api.md",
      "@@ -10 +9,0 @@",
      "-export function createOryMiddleware(options: OryMiddlewareOptions): (r: NextRequest) => Promise<NextResponse<unknown>>;",
      "@@ -20,0 +20 @@",
      "+export function createOryMiddleware(options: OryMiddlewareOptions): (r: NextRequest) => Promise<NextResponse<unknown>>;",
    ].join("\n")
    assert.equal(apiReportChange(diff), "none")
  })

  it("treats a member moved to another declaration as breaking", () => {
    const diff = [
      "--- a/packages/elements-react/api-report/elements-react.api.md",
      "+++ b/packages/elements-react/api-report/elements-react.api.md",
      "@@ -10 +9,0 @@ export interface FooProps {",
      "-    className?: string;",
      "@@ -20,0 +20 @@ export interface BarProps {",
      "+    className?: string;",
    ].join("\n")
    assert.equal(apiReportChange(diff), "breaking")
  })

  it("ignores a member that only moved within its declaration", () => {
    const diff = [
      "--- a/packages/elements-react/api-report/elements-react.api.md",
      "+++ b/packages/elements-react/api-report/elements-react.api.md",
      "@@ -10 +9,0 @@ export interface FooProps {",
      "-    className?: string;",
      "@@ -14,0 +13 @@ export interface FooProps {",
      "+    className?: string;",
    ].join("\n")
    assert.equal(apiReportChange(diff), "none")
  })

  it("assigns members to a declaration added in the same hunk", () => {
    const diff = [
      "--- a/packages/elements-react/api-report/elements-react.api.md",
      "+++ b/packages/elements-react/api-report/elements-react.api.md",
      "@@ -10 +9,0 @@ export interface FooProps {",
      "-    className?: string;",
      "@@ -20,0 +20,3 @@ export interface BarProps {",
      "+export interface FooProps {",
      "+    className?: string;",
      "+}",
    ].join("\n")
    assert.equal(apiReportChange(diff), "additive")
  })

  it("treats a removed export as breaking", () => {
    const diff = [
      "--- a/packages/nextjs/api-report/nextjs.api.md",
      "+++ b/packages/nextjs/api-report/nextjs.api.md",
      "@@ -40,2 +39,0 @@",
      "-// @public (undocumented)",
      "-export function getLogoutFlow(params?: { returnTo?: string }): Promise<LogoutFlow>;",
    ].join("\n")
    assert.equal(apiReportChange(diff), "breaking")
  })
})

describe("slotsChange", () => {
  it("reports nothing when the slots are unchanged", () => {
    assert.equal(slotsChange(baseSlots, structuredClone(baseSlots)), "none")
  })

  it("treats a removed or renamed slot as breaking", () => {
    const head = structuredClone(baseSlots)
    head.slots[2].path = "Node.Link"
    assert.equal(slotsChange(baseSlots, head), "breaking")
  })

  it("treats a new slot as additive", () => {
    const head = structuredClone(baseSlots)
    head.slots.push({ ...head.slots[0], path: "Node.Select" })
    assert.equal(slotsChange(baseSlots, head), "additive")
  })

  it("treats other edits as additive", () => {
    const head = structuredClone(baseSlots)
    head.slots[0].description = "A button."
    assert.equal(slotsChange(baseSlots, head), "additive")
  })

  it("treats a new slots file as additive", () => {
    assert.equal(slotsChange(null, baseSlots), "additive")
  })
})

describe("requiredBump", () => {
  it("requires a major for breaking changes from 1.0.0 on", () => {
    assert.equal(requiredBump("breaking", "1.2.1"), "major")
    assert.equal(requiredBump("breaking", "1.0.0-rc.1"), "major")
  })

  it("accepts a minor for breaking changes under 0.x", () => {
    assert.equal(requiredBump("breaking", "0.3.0"), "minor")
    assert.equal(requiredBump("breaking", "0.0.0"), "minor")
  })

  it("requires any changeset for additive changes", () => {
    assert.equal(requiredBump("additive", "1.2.1"), "patch")
  })

  it("requires nothing without a change", () => {
    assert.equal(requiredBump("none", "1.2.1"), null)
  })
})

describe("changesetBumps", () => {
  it("keeps the highest bump per package", () => {
    assert.deepEqual(
      changesetBumps([
        [{ name: "@ory/nextjs", type: "patch" }],
        [
          { name: "@ory/nextjs", type: "major" },
          { name: "@ory/elements-react", type: "minor" },
        ],
        [{ name: "@ory/nextjs", type: "minor" }],
      ]),
      { "@ory/nextjs": "major", "@ory/elements-react": "minor" },
    )
  })
})

describe("gateFailures", () => {
  const requirements: BumpRequirement[] = [
    {
      name: "@ory/nextjs",
      bump: "major",
      reasons: ["packages/nextjs/api-report/nextjs.api.md"],
    },
    {
      name: "@ory/elements-react",
      bump: "patch",
      reasons: ["packages/elements-react/agents/slots.json"],
    },
  ]

  it("passes when every package has a large enough changeset", () => {
    assert.deepEqual(
      gateFailures(requirements, {
        "@ory/nextjs": "major",
        "@ory/elements-react": "patch",
      }),
      [],
    )
  })

  it("fails when a package has no changeset", () => {
    assert.deepEqual(gateFailures(requirements, { "@ory/nextjs": "major" }), [
      "@ory/elements-react needs a changeset (packages/elements-react/agents/slots.json changed).",
    ])
  })

  it("fails when a breaking change has a smaller bump", () => {
    assert.deepEqual(
      gateFailures(requirements, {
        "@ory/nextjs": "minor",
        "@ory/elements-react": "patch",
      }),
      [
        "@ory/nextjs needs a major changeset, found minor (breaking change in packages/nextjs/api-report/nextjs.api.md).",
      ],
    )
  })

  it("names the bump a breaking change needs when there is no changeset", () => {
    assert.deepEqual(
      gateFailures(requirements, { "@ory/elements-react": "patch" }),
      [
        "@ory/nextjs needs a major changeset (packages/nextjs/api-report/nextjs.api.md changed).",
      ],
    )
  })

  it("does not accept a none bump as a changeset", () => {
    assert.equal(
      gateFailures(requirements, {
        "@ory/nextjs": "major",
        "@ory/elements-react": "none",
      }).length,
      1,
    )
  })
})
