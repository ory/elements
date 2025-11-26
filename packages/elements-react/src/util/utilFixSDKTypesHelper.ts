import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"

// Explanation:
// The way we generate the SDK makes the default UINode types very difficult to work.
// UiNode is a polymorphic type, but the polymorphism is expressed in a child property.
// This makes type narrowing very difficult and requires a lot of type assertions in the codebase.
// To fix this, we create our own type definitions that express the polymorphism at the top level.
// This makes it much easier to work with the types and reduces the need for type assertions.
// It's also safe, because there's already a `type` property that can be used to discriminate the types. It's just not used in the SDK types.
// TL;DR: We are fixing the SDK types to make them easier to work with.
// Fixing these in the SDK directly would likely be a breaking change, so we do it here for now.

export type UiNodeInput = UiNode & {
  type: "input"
  attributes: UiNodeInputAttributes
}
export function isUiNodeInput(node: UiNode): node is UiNodeInput {
  return node.type === "input"
}

export type UiNodeImage = UiNode & {
  type: "img"
  attributes: UiNodeImageAttributes
}

export function isUiNodeImage(node: UiNode): node is UiNodeImage {
  return node.type === "img"
}

export type UiNodeAnchor = UiNode & {
  type: "a"
  attributes: UiNodeAnchorAttributes
}

export function isUiNodeAnchor(node: UiNode): node is UiNodeAnchor {
  return node.type === "a"
}

export type UiNodeText = UiNode & {
  type: "text"
  attributes: UiNodeTextAttributes
}

export function isUiNodeText(node: UiNode): node is UiNodeText {
  return node.type === "text"
}

export type UiNodeScript = UiNode & {
  type: "script"
  attributes: UiNodeScriptAttributes
}

export function isUiNodeScript(node: UiNode): node is UiNodeScript {
  return node.type === "script"
}

export type UiNodeDiv = UiNode & {
  type: "div"
  attributes: UiNodeDivisionAttributes
}

export function isUiNodeDiv(node: UiNode): node is UiNodeDiv {
  return node.type === "div"
}

export type UiNodeFixed =
  | UiNodeInput
  | UiNodeImage
  | UiNodeAnchor
  | UiNodeText
  | UiNodeScript
  | UiNodeDiv
