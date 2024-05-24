// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import {
  filterNodesByGroups,
  FilterNodesByGroups,
  getNodeLabelText,
} from "./index"
import nodes from "./fixtures/nodes.json"

describe("generic helpers", () => {
  const testNodes: any[] = [
    { group: "default", type: "a" },
    { group: "foo", type: "b" },
    { group: "bar", type: "c" },
    {
      group: "default",
      attributes: {
        name: "a",
        type: "checkbox",
        node_type: "input",
      },
    },
    {
      group: "foo",
      attributes: {
        name: "c",
        type: "hidden",
        node_type: "input",
      },
    },
    {
      group: "webauthn",
      attributes: {
        name: "d",
        type: "script",
        node_type: "input",
      },
    },
    {
      group: "webauthn",
      attributes: {
        name: "e",
        type: "input",
        node_type: "input",
      },
    },
    {
      group: "totp",
      attributes: {
        name: "f",
        type: "input",
        node_type: "input",
      },
    },
    {
      group: "default",
      attributes: {
        name: "g",
        type: "hidden",
        node_type: "input",
      },
    },
  ]

  const uiNodes = testNodes as UiNode[]

  const tc: {
    description: string
    opts: Partial<FilterNodesByGroups>
    expected: any[]
  }[] = [
    {
      description: "nodes with the checkbox attribute",
      opts: {
        attributes: "checkbox",
        withoutDefaultAttributes: true,
      },
      expected: [
        {
          group: "default",
          attributes: {
            name: "a",
            type: "checkbox",
            node_type: "input",
          },
        },
      ],
    },
    {
      description:
        "filtering by nodes should always include the default attributes",
      opts: {
        attributes: "email",
        withoutDefaultAttributes: false,
      },
      expected: [
        {
          group: "webauthn",
          attributes: {
            name: "d",
            type: "script",
            node_type: "input",
          },
        },
        {
          group: "webauthn",
          attributes: {
            name: "e",
            type: "input",
            node_type: "input",
          },
        },
        {
          group: "totp",
          attributes: {
            name: "f",
            type: "input",
            node_type: "input",
          },
        },
        {
          group: "default",
          attributes: {
            name: "g",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
    {
      description:
        "can filter by nodes using comma seperated groups and should always include the default groups",
      opts: {
        groups: "foo,bar",
      },
      expected: [
        { group: "default", type: "a" },
        { group: "foo", type: "b" },
        { group: "bar", type: "c" },
        {
          group: "default",
          attributes: {
            name: "a",
            type: "checkbox",
            node_type: "input",
          },
        },
        {
          group: "foo",
          attributes: {
            name: "c",
            type: "hidden",
            node_type: "input",
          },
        },
        {
          group: "default",
          attributes: {
            name: "g",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
    {
      description:
        "can filter by nodes using an array of groups and should always include the default groups",
      opts: {
        groups: ["foo", "bar"],
      },
      expected: [
        { group: "default", type: "a" },
        { group: "foo", type: "b" },
        { group: "bar", type: "c" },
        {
          group: "default",
          attributes: {
            name: "a",
            type: "checkbox",
            node_type: "input",
          },
        },
        {
          group: "foo",
          attributes: {
            name: "c",
            type: "hidden",
            node_type: "input",
          },
        },
        {
          group: "default",
          attributes: {
            name: "g",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
    {
      description:
        "can filter by nodes using a group and exclude default groups",
      opts: {
        groups: ["foo"],
        withoutDefaultGroup: true,
      },
      expected: [
        { group: "foo", type: "b" },
        {
          group: "foo",
          attributes: {
            name: "c",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
    {
      description: "can filter by attributes and exclude default attributes",
      opts: {
        attributes: "hidden",
        withoutDefaultAttributes: true,
      },
      expected: [
        {
          group: "foo",
          attributes: {
            name: "c",
            type: "hidden",
            node_type: "input",
          },
        },
        {
          group: "default",
          attributes: {
            name: "g",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
    {
      description: "can filter by nodes and exclude attributes",
      opts: {
        groups: "webauthn",
        withoutDefaultGroup: true,
        excludeAttributeTypes: "script",
      },
      expected: [
        {
          group: "webauthn",
          attributes: {
            name: "e",
            type: "input",
            node_type: "input",
          },
        },
      ],
    },
    {
      description:
        "filtering by attributes should always include the default attributes even when group is not defined",
      opts: {
        attributes: "something",
      },
      expected: [
        {
          group: "webauthn",
          attributes: {
            name: "d",
            type: "script",
            node_type: "input",
          },
        },
        {
          group: "webauthn",
          attributes: {
            name: "e",
            type: "input",
            node_type: "input",
          },
        },
        {
          group: "totp",
          attributes: {
            name: "f",
            type: "input",
            node_type: "input",
          },
        },
        {
          group: "default",
          attributes: {
            name: "g",
            type: "hidden",
            node_type: "input",
          },
        },
      ],
    },
  ]

  test.each(tc)("$description", ({ opts, expected }) => {
    expect(
      filterNodesByGroups({
        nodes: uiNodes,
        ...opts,
      }),
    ).toEqual(expected)
  })

  test("getNodeLabel", () => {
    expect(
      (nodes as unknown as UiNode[]).map(getNodeLabelText),
    ).toMatchSnapshot()
  })
})
