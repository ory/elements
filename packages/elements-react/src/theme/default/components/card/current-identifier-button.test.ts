// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeTypeEnum } from "@ory/client-fetch"
import {
  getBackButtonNodeAttributes,
  guessRegistrationBackButton,
} from "./current-identifier-button"

test("getBackButtonNode should return the correct node for FlowType.Login", () => {
  const nodes = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "identifier",
        node_type: UiNodeTypeEnum.Input,
        value: "office@ory.dev",
      },
      group: "identifier_first",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "email",
        node_type: UiNodeTypeEnum.Input,
        value: "office@ory.dev",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Login, nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("getBackButtonNode should return the correct node for FlowType.Registration", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.email",
        node_type: UiNodeTypeEnum.Input,
        value: "office@ory.dev",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: UiNodeTypeEnum.Input,
        value: "office",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Registration, nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("getBackButtonNode should return the correct node for FlowType.Recovery", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: { name: "other", node_type: UiNodeTypeEnum.Input },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "email",
        node_type: UiNodeTypeEnum.Input,
        value: "office@ory.dev",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Recovery, nodes)
  expect(result).toEqual(nodes[1].attributes)
})

test("getBackButtonNode should return the correct node for FlowType.Verification", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "email",
        node_type: UiNodeTypeEnum.Input,
        value: "office@ory.dev",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: UiNodeTypeEnum.Input,
        value: "office",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Verification, nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("getBackButtonNode should return undefined if no matching node is found", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: { name: "non-matching", node_type: UiNodeTypeEnum.Input },
      group: "non-matching-group",
    },
  ] as unknown[] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Login, nodes)
  expect(result).toBeUndefined()
})
test("getBackButtonNode should return traits.username for Registration when email is not available", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: "input",
        value: "johndoe",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: { name: "other", node_type: "input" },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Registration, nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("getBackButtonNode should return traits.phone_number for Registration as last resort", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: { name: "other", node_type: "input" },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.phone_number",
        node_type: "input",
        value: "+1234567890",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Registration, nodes)
  expect(result).toEqual(nodes[1].attributes)
})

test("getBackButtonNode should return undefined for Registration when no preferred traits are found", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.other",
        node_type: "input",
        value: "something",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Registration, nodes)
  expect(result).toBeUndefined()
})

test("getBackButtonNode should return undefined for Recovery when email node has no value", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: { name: "email", node_type: "input" }, // No value
      group: "default",
    },
  ] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Recovery, nodes)
  expect(result).toBeUndefined()
})

test("getBackButtonNode should return undefined for Verification when email node has wrong type", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "email",
        node_type: "not-input",
        value: "office@ory.dev",
      },
      group: "default",
    },
  ] as unknown[] as UiNode[]

  const result = getBackButtonNodeAttributes(FlowType.Verification, nodes)
  expect(result).toBeUndefined()
})

test("guessRegistrationBackButton should return traits.email when available", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.email",
        node_type: "input",
        value: "test@example.com",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: "input",
        value: "testuser",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = guessRegistrationBackButton(nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("guessRegistrationBackButton should return traits.username when email is not available", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: "input",
        value: "testuser",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.phone_number",
        node_type: "input",
        value: "+1234567890",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = guessRegistrationBackButton(nodes)
  expect(result).toEqual(nodes[0].attributes)
})

test("guessRegistrationBackButton should ignore nodes with non-default group", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.email",
        node_type: "input",
        value: "test@example.com",
      },
      group: "non-default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.username",
        node_type: "input",
        value: "testuser",
      },
      group: "default",
    },
  ] as UiNode[]

  const result = guessRegistrationBackButton(nodes)
  expect(result).toEqual(nodes[1].attributes)
})

test("guessRegistrationBackButton should return undefined when no matching nodes exist", () => {
  const nodes: UiNode[] = [
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.other",
        node_type: "input",
        value: "something",
      },
      group: "default",
    },
    {
      type: UiNodeTypeEnum.Input,
      attributes: {
        name: "traits.email",
        node_type: "input",
        value: "test@example.com",
      },
      group: "wrong-group",
    },
  ] as UiNode[]

  const result = guessRegistrationBackButton(nodes)
  expect(result).toBeUndefined()
})
