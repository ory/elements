// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
  UiText,
} from "@ory/client-fetch"

/**
 * Returns the node's label.
 *
 * @param node
 * @return label
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
 * @param attrs
 */
export function isUiNodeAnchorAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeAnchorAttributes {
  return attrs.node_type === "a"
}

/**
 * A TypeScript type guard for nodes of the type <img>
 *
 * @param attrs
 */
export function isUiNodeImageAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeImageAttributes {
  return attrs.node_type === "img"
}

/**
 * A TypeScript type guard for nodes of the type <input>
 *
 * @param attrs
 */
export function isUiNodeInputAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeInputAttributes {
  return attrs.node_type === "input"
}

/**
 * A TypeScript type guard for nodes of the type <span>{text}</span>
 *
 * @param attrs
 */
export function isUiNodeTextAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeTextAttributes {
  return attrs.node_type === "text"
}

/**
 * A TypeScript type guard for nodes of the type <script>
 *
 * @param attrs
 */
export function isUiNodeScriptAttributes(
  attrs: ObjWithNodeType,
): attrs is UiNodeScriptAttributes {
  return attrs.node_type === "script"
}

/**
 * Returns a node's ID.
 *
 * @param attributes
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
 * @param attr
 * @returns type of node
 */
export const getNodeInputType = (attr: any): string => attr?.["type"] ?? ""
