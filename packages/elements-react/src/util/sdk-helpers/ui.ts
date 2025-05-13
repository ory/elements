// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
  UiNodeDivisionAttributes,
  UiText,
} from "../"

/**
 * Returns the node's label.
 *
 * @param node - the node get the label from
 * @returns label of the node
 */
export const getNodeLabel = (node: UiNode): UiText | undefined => {
  const attributes = node.attributes
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.title
  }

  if (isUiNodeImageAttributes(attributes)) {
    return node.meta.label
  }

  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.label) {
      return attributes.label
    }
  }

  return node.meta.label
}

type ObjWithNodeType = {
  node_type: string
}

/**
 * A TypeScript type guard for nodes of the type <a>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeAnchorAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeAnchorAttributes {
  return attrs.node_type === "a"
}

/**
 * A TypeScript type guard for nodes of the type <img>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeImageAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeImageAttributes {
  return attrs.node_type === "img"
}

/**
 * A TypeScript type guard for nodes of the type <input>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeInputAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeInputAttributes {
  return attrs.node_type === "input"
}

/**
 * A TypeScript type guard for nodes of the type <div>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeDivAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeDivisionAttributes {
  return attrs.node_type === "div"
}

/**
 * A TypeScript type guard for nodes of the type `<span>{text}</span>`
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeTextAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeTextAttributes {
  return attrs.node_type === "text"
}

/**
 * A TypeScript type guard for nodes of the type <script>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeScriptAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeScriptAttributes {
  return attrs.node_type === "script"
}

/**
 * Returns a node's ID.
 *
 * @param attributes - the attributes of the node
 */
export function getNodeId({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    return attributes.name
  } else {
    return attributes.id
  }
}

/**
 * Return the node input attribute type
 * In <input> elements we have a variety of types, such as text, password, email, etc.
 * When the attribute is null or the `type` attribute is not present, we assume it has no defined type.
 *
 * @param attr - the attributes of the node
 * @returns type of node
 */
export const getNodeInputType = (attr: object): string =>
  "type" in attr && typeof attr?.type == "string" ? attr.type : ""
