// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  type UiNodeAttributes,
  type UiNodeInputAttributesOnclickTriggerEnum,
  type UiNodeInputAttributesOnloadTriggerEnum,
} from "@ory/client-fetch"

/**
 * Replaces the flow ID in the browser URL without triggering a navigation.
 *
 * @param flowId - The new flow ID to set in the URL
 */
export function replaceWindowFlowId(flowId: string): void {
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href)
    url.searchParams.set("flow", flowId)
    window.history.replaceState({}, "", url.toString())
  }
}

/**
 * Triggers a window function call for WebAuthn scripts.
 *
 * @param trigger - The trigger function name
 */
export function triggerToWindowCall(
  trigger:
    | UiNodeInputAttributesOnclickTriggerEnum
    | UiNodeInputAttributesOnloadTriggerEnum
    | undefined,
) {
  if (!trigger) {
    return
  }

  const fn = triggerToFunction(trigger)
  if (fn) {
    fn()
    return
  }

  // Retry every 100ms for 10 seconds
  let i = 0
  const ms = 100
  const interval = setInterval(() => {
    i++
    if (i > 100) {
      clearInterval(interval)
      throw new Error(
        "Unable to load Ory's WebAuthn script. Is it being blocked or otherwise failing to load? If you are running an old version of Ory Elements, please upgrade. For more information, please check your browser's developer console.",
      )
    }

    const fn = triggerToFunction(trigger)
    if (fn) {
      clearInterval(interval)
      return fn()
    }
  }, ms)
  return
}

/**
 * Converts a trigger string to the corresponding window function.
 *
 * @param trigger - The trigger function name
 */
export function triggerToFunction(
  trigger:
    | UiNodeInputAttributesOnclickTriggerEnum
    | UiNodeInputAttributesOnloadTriggerEnum,
) {
  if (typeof window === "undefined") {
    console.debug(
      "The Ory SDK is missing a required function: window is undefined.",
    )
    return undefined
  }

  const typedWindow = window as unknown as { [key: string]: unknown }
  if (!(trigger in typedWindow) || !typedWindow[trigger]) {
    console.debug(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }
  const triggerFn = typedWindow[trigger]
  if (typeof triggerFn !== "function") {
    console.debug(
      `The Ory SDK is missing a required function: ${trigger}. It is not a function.`,
    )
    return undefined
  }
  return triggerFn as () => void
}

/**
 * Returns a list of auth methods from a list of nodes. For example,
 * if Password and Passkey are present, it will return [password, passkey].
 *
 * Please note that OIDC is not considered an auth method because it is
 * usually shown as a separate auth method
 *
 * This method excludes the default, identifier_first, and profile groups.
 *
 * @param nodes - The nodes to extract the auth methods from
 * @param excludeAuthMethods - A list of auth methods to exclude
 */
export function nodesToAuthMethodGroups(
  nodes: Array<UiNode>,
  excludeAuthMethods: UiNodeGroupEnum[] = [],
): UiNodeGroupEnum[] {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}

  for (const node of nodes) {
    if (node.type === "script") {
      // We always render all scripts, because the scripts for passkeys are part of the webauthn group,
      // which leads to this hook returning a webauthn group on passkey flows (which it should not - webauthn is the "legacy" passkey implementation).
      continue
    }
    const groupNodes = groups[node.group] ?? []
    groupNodes.push(node)
    groups[node.group] = groupNodes
  }

  return Object.values(UiNodeGroupEnum)
    .filter((group) => groups[group]?.length)
    .filter(
      (group) =>
        !(
          [
            UiNodeGroupEnum.Default,
            UiNodeGroupEnum.IdentifierFirst,
            UiNodeGroupEnum.Profile,
            UiNodeGroupEnum.Captcha,
            ...excludeAuthMethods,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )
}

// Node finder types
type NodeType = UiNodeAttributes["node_type"]
type FindOptions<T extends NodeType = NodeType> = {
  node_type: T
  group?: UiNodeGroupEnum | RegExp
  id?: string | RegExp
  name?: string | RegExp
  type?: string | RegExp
}

const finder = (opt: FindOptions) => (n: UiNode) => {
  return (
    n.attributes.node_type === opt.node_type &&
    (opt.group
      ? opt.group instanceof RegExp
        ? n.group.match(opt.group)
        : n.group === opt.group
      : !opt.group) &&
    (opt.id && n.attributes.node_type !== "input"
      ? opt.id instanceof RegExp
        ? n.attributes.id.match(opt.id)
        : n.attributes.id === opt.id
      : !opt.id) &&
    (opt.name && n.attributes.node_type === "input"
      ? opt.name instanceof RegExp
        ? n.attributes.name.match(opt.name)
        : n.attributes.name === opt.name
      : !opt.name) &&
    (opt.type && n.attributes.node_type === "input"
      ? opt.type instanceof RegExp
        ? n.attributes.type.match(opt.type)
        : n.attributes.type === opt.type
      : !opt.type)
  )
}

/**
 * Find a node
 *
 * @param nodes - The list of nodes to search
 * @param opt  - The matching options
 * @returns The first matching node
 */
export const findNode = <T extends NodeType>(
  nodes: UiNode[],
  opt: FindOptions<T>,
) =>
  nodes.find(finder(opt)) as
    | (UiNode & { attributes: UiNodeAttributes & { node_type: T } })
    | undefined

/**
 * Returns functional nodes not related to credentials (e.g. password node) but
 * nodes belonging profile information, identifier first nodes, captcha, or default
 * nodes (e.g. csrf_token).
 *
 * @param nodes - Array of nodes to filter on.
 */
export function getFunctionalNodes(nodes: UiNode[]) {
  return nodes.filter(({ group }) =>
    (
      [
        UiNodeGroupEnum.Default,
        UiNodeGroupEnum.IdentifierFirst,
        UiNodeGroupEnum.Profile,
        UiNodeGroupEnum.Captcha,
      ] as UiNodeGroupEnum[]
    ).includes(group),
  )
}

/**
 * Type guard for UiNodeGroupEnum
 *
 * @param method - The string to type guard
 */
export function isUiNodeGroupEnum(method: string): method is UiNodeGroupEnum {
  return Object.values(UiNodeGroupEnum).includes(method as UiNodeGroupEnum)
}

/**
 * Returns true if the node is of group saml or oidc.
 *
 * @param node - The node
 */
function isSingleSignOnNode(node: UiNode): boolean {
  return (
    node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml
  )
}

/**
 * Returns true if the node group contains oidc or saml nodes.
 *
 * @param nodes - Array of nodes to search in.
 */
export function hasSingleSignOnNodes(nodes: UiNode[]) {
  return nodes.some(isSingleSignOnNode)
}

/**
 * Returns all nodes that are not single sign on nodes (saml, oidc).
 *
 * @param nodes - Array of nodes to filter.
 */
export function withoutSingleSignOnNodes(nodes: UiNode[]) {
  return nodes.filter((node: UiNode) => !isSingleSignOnNode(node))
}

/**
 * Returns true if the node is visible.
 *
 * @param node - The node to check.
 */
export function isNodeVisible(node: UiNode) {
  if (isUiNodeScriptAttributes(node.attributes)) {
    return false
  } else if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === "hidden") {
      return false
    }
  }
  return true
}

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

/**
 * Groups nodes and returns only groups with visible nodes.
 *
 * @param nodes - Array of nodes to process
 */
export function getNodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
  const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

  for (const node of nodes) {
    const groupNodes = groups[node.group] ?? []
    const groupCount = groupRetained[node.group] ?? 0

    groupNodes.push(node)
    groups[node.group] = groupNodes
    if (!isNodeVisible(node)) {
      continue
    }

    groupRetained[node.group] = groupCount + 1
  }

  const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
  for (const [group, count] of Object.entries(groupRetained)) {
    if (count > 0) {
      finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
    }
  }

  return finalGroups
}
