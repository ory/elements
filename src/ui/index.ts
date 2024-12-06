// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from "@ory/client"

/**
 * Returns the node's label.
 *
 * @param node
 * @return label
 */
export const getNodeLabelText = (node: UiNode): string => {
  const attributes = node.attributes
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.title.text
  }

  if (isUiNodeImageAttributes(attributes)) {
    return node.meta.label?.text ?? ""
  }

  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.label?.text) {
      return attributes.label.text
    }
  }

  return node.meta.label?.text ?? ""
}

/**
 * A TypeScript type guard for nodes of the type <a>
 *
 * @param attrs
 */
export function isUiNodeAnchorAttributes(
  attrs: UiNodeAttributes,
): attrs is UiNodeAnchorAttributes & { node_type: "a" } {
  return attrs.node_type === "a"
}

/**
 * A TypeScript type guard for nodes of the type <img>
 *
 * @param attrs
 */
export function isUiNodeImageAttributes(
  attrs: UiNodeAttributes,
): attrs is UiNodeImageAttributes & { node_type: "img" } {
  return attrs.node_type === "img"
}

/**
 * A TypeScript type guard for nodes of the type <input>
 *
 * @param attrs
 */
export function isUiNodeInputAttributes(
  attrs: UiNodeAttributes,
): attrs is UiNodeInputAttributes & { node_type: "input" } {
  return attrs.node_type === "input"
}

/**
 * A TypeScript type guard for nodes of the type <span>{text}</span>
 *
 * @param attrs
 */
export function isUiNodeTextAttributes(
  attrs: UiNodeAttributes,
): attrs is UiNodeTextAttributes & { node_type: "text" } {
  return attrs.node_type === "text"
}

/**
 * A TypeScript type guard for nodes of the type <script>
 *
 * @param attrs
 */
export function isUiNodeScriptAttributes(
  attrs: UiNodeAttributes,
): attrs is UiNodeScriptAttributes & { node_type: "script" } {
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
    return "id" in attributes ? attributes.id : ""
  }
}

/**
 * Return the node input attribute type
 * In <input> elements we have a variety of types, such as text, password, email, etc.
 * When the attribute is null or the `type` attribute is not present, we assume it has no defined type.
 * @param attr
 * @returns type of node
 */
export const getNodeInputType = (attr?: UiNodeAttributes) => {
  if (!attr) return ""
  if (isUiNodeInputAttributes(attr)) {
    return attr.type
  }
  return ""
}

export interface FilterNodesByGroups {
  nodes: UiNode[]
  groups?: string[] | string
  withoutDefaultGroup?: boolean
  attributes?: string[] | string
  withoutDefaultAttributes?: boolean
  excludeAttributeTypes?: string[] | string
  excludeAttributeValues?: string[] | string
}

/**
 * Filters nodes by their groups and attributes.
 * If no filtering options are specified, all nodes are returned.
 * Will always add default nodes unless `withoutDefaultGroup` is true.
 * Will always add default attributes unless `withoutDefaultAttributes` is true.
 * @param filterNodesByGroups - An object containing the nodes and the filtering options.
 * @param {Array<UiNode>} filterNodesByGroups.nodes - An array of nodes.
 * @param {Array<UiNodeGroupEnum | string> | string} filterNodesByGroups.groups - An array or comma seperated strings of groups to filter by.
 * @param {boolean} filterNodesByGroups.withoutDefaultGroup - If true, will not add default nodes under the 'default' category.
 * @param {Array<UiNodeInputAttributesTypeEnum | string> | string} filterNodesByGroups.attributes - An array or comma seperated strings of attributes to filter by.
 * @param {boolean} filterNodesByGroups.withoutDefaultAttributes - If true, will not add default attributes such as 'hidden' and 'script'.
 */
export const filterNodesByGroups = ({
  nodes,
  groups,
  withoutDefaultGroup,
  attributes,
  withoutDefaultAttributes,
  excludeAttributeTypes,
  excludeAttributeValues,
}: FilterNodesByGroups) => {
  const search = (s: string[] | string | undefined) =>
    typeof s === "string" ? s.split(",") : s

  return nodes.filter(({ group, attributes: attr }) => {
    // if we have not specified any group or attribute filters, return all nodes
    if (!groups && !attributes && !excludeAttributeTypes) return true

    const g = search(groups) ?? []
    if (!withoutDefaultGroup) {
      g.push("default")
    }

    // filter the attributes
    const a = search(attributes) ?? []
    if (!withoutDefaultAttributes) {
      // always add hidden fields e.g. csrf
      if (group.includes("default")) {
        a.push("hidden")
      }
      // automatically add the necessary fields for webauthn and totp
      if (group.includes("webauthn") || group.includes("totp")) {
        a.push("input", "script")
      }
    }

    // filter the attributes to exclude
    const eat = search(excludeAttributeTypes) ?? []
    const eav = search(excludeAttributeValues) ?? []

    const filterGroup = groups ? g.includes(group) : true
    const filterAttributes = attributes
      ? a.includes(getNodeInputType(attr))
      : true
    const filterExcludeAttributeTypes = excludeAttributeTypes
      ? !eat.includes(getNodeInputType(attr))
      : true
    const filterExcludeAttributeValue = excludeAttributeValues
      ? !eav.includes(getNodeInputValue(attr))
      : true

    return (
      filterGroup &&
      filterAttributes &&
      filterExcludeAttributeTypes &&
      filterExcludeAttributeValue
    )
  })
}

export const getNodeInputValue = (attr?: UiNodeAttributes) => {
  if (!attr) return ""
  if (isUiNodeInputAttributes(attr)) {
    return String(attr.value)
  }
  return ""
}
