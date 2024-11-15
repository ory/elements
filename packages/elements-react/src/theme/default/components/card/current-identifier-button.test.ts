// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode } from "@ory/client-fetch"
import { getBackButtonNode } from "./current-identifier-button"

test("getBackButtonNode should return the correct node for FlowType.Login", () => {
  const nodes = [
    {
      attributes: { name: "identifier" },
      group: "identifier_first",
    },
    {
      attributes: { name: "email" },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNode(FlowType.Login, nodes)
  expect(result).toEqual({
    attributes: { name: "identifier" },
    group: "identifier_first",
  })
})

test("getBackButtonNode should return the correct node for FlowType.Registration", () => {
  const nodes: UiNode[] = [
    {
      attributes: { name: "traits.email" },
      group: "default",
    },
    {
      attributes: { name: "traits.username" },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNode(FlowType.Registration, nodes)
  expect(result).toEqual({
    attributes: { name: "traits.email" },
    group: "default",
  })
})

test("getBackButtonNode should return the correct node for FlowType.Recovery", () => {
  const nodes: UiNode[] = [
    {
      attributes: { name: "email" },
      group: "default",
    },
    {
      attributes: { name: "other" },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNode(FlowType.Recovery, nodes)
  expect(result).toEqual({
    attributes: { name: "email" },
    group: "default",
  })
})

test("getBackButtonNode should return the correct node for FlowType.Verification", () => {
  const nodes: UiNode[] = [
    {
      attributes: { name: "email" },
      group: "default",
    },
    {
      attributes: { name: "traits.username" },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNode(FlowType.Verification, nodes)
  expect(result).toEqual({
    attributes: { name: "email" },
    group: "default",
  })
})

test("getBackButtonNode should return undefined if no matching node is found", () => {
  const nodes: UiNode[] = [
    {
      attributes: { name: "non-matching" },
      group: "non-matching-group",
    },
  ] as unknown[] as UiNode[]

  const result = getBackButtonNode(FlowType.Login, nodes)
  expect(result).toBeUndefined()
})
