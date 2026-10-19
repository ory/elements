/**
 * @jest-environment node
 */
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from "fs"
import { join } from "path"
import {
  agentDocs,
  checkSlotReferences,
  findSlotProblems,
  packageRootOf,
} from "../../scripts/agent-docs"
import {
  buildSlotMap,
  renderJson,
  renderMarkdown,
  SlotMap,
} from "../../scripts/slot-map"

const packageRoot = packageRootOf(__filename)
const refresh =
  "Run `pnpm exec nx run @ory/elements-react:slot-map` and commit the result."

jest.setTimeout(180_000)

let map: SlotMap

beforeAll(() => {
  map = buildSlotMap()
})

function shipped(file: string) {
  return readFileSync(join(packageRoot, "agents", file), "utf8")
}

test("should describe every slot of OryFlowComponents", () => {
  expect(map.slots.map((slot) => slot.group)).toEqual(
    expect.arrayContaining(["Card", "Node", "Form", "Message", "Page"]),
  )
  expect(map.slots.find((slot) => slot.path === "Card.Header")).toMatchObject({
    required: true,
    propsType: "OryCardProps",
    propsImport: "@ory/elements-react",
    defaultComponent: "DefaultCardHeader",
    defaultImport: "@ory/elements-react/theme",
    props: [{ name: "children", optional: true }],
  })
  expect(map.slots.find((slot) => slot.path === "Node.Select")).toMatchObject({
    required: false,
  })
})

test("should leave the props of the rendered HTML element out of the list", () => {
  const anchor = map.slots.find((slot) => slot.path === "Node.Anchor")

  expect(anchor?.props.map((prop) => prop.name)).toEqual(["attributes", "node"])
  expect(anchor?.inheritedProps).toBeGreaterThan(100)
})

test(`should ship an up-to-date agents/slots.json. ${refresh}`, () => {
  expect(shipped("slots.json")).toBe(renderJson(map))
})

test(`should ship an up-to-date agents/slots.md. ${refresh}`, () => {
  expect(shipped("slots.md")).toBe(renderMarkdown(map))
})

test("should only name slots and props types that exist in the bundled agent docs", () => {
  expect(checkSlotReferences(agentDocs(packageRoot), map)).toEqual([])
})

test("should report a slot that does not exist and a props type that does not match", () => {
  expect(
    findSlotProblems(
      "Use `Card.CardHeader`.\n\n| `Node.Button` | `OryNodeInputProps` |\n",
      map,
    ),
  ).toEqual([
    expect.stringContaining("`Card.CardHeader` is not a slot"),
    expect.stringContaining(
      "`Node.Button` takes `OryNodeButtonProps`, not `OryNodeInputProps`",
    ),
  ])
})
