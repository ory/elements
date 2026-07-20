// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiText,
} from "@ory/client-fetch"

import type {
  UiNodeAttributes,
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
} from "@ory/client-fetch"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { useMemo } from "react"
import { useGroupSorter } from "../../context/component"
import { UiNodeInput } from "../utilFixSDKTypesHelper"

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

  const typedWindow = window as { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
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

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

/**
 * Returns a list of auth methods from a list of nodes. For example,
 * if Password and Passkey are present, it will return [password, passkey].
 *
 * Please note that OIDC is not considered an auth method because it is
 * usually shown as a separate auth method
 *
 * This method the default, identifier_first, and profile groups.
 *
 * @param nodes - The nodes to extract the auth methods from
 * @param excludeAuthMethods - A list of auth methods to exclude
 */
export function nodesToAuthMethodGroups(
  nodes: Array<UiNode>,
  excludeAuthMethods = [],
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

/**
 * Groups nodes by their group and returns an object with the groups and entries.
 *
 * @deprecated use useNodeGroupsWithVisibleNodes instead
 * @param nodes - The nodes to group
 * @param opts - The options to use
 */
export function useNodesGroups(
  nodes: UiNode[],
  { omit }: { omit?: Array<"script" | "input_hidden"> } = {},
) {
  const groupSorter = useGroupSorter()

  const groups = useMemo(() => {
    const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

    for (const node of nodes) {
      const groupNodes = groups[node.group] ?? []
      groupNodes.push(node)
      groups[node.group] = groupNodes

      if (
        omit?.includes("script") &&
        isUiNodeScriptAttributes(node.attributes)
      ) {
        continue
      }

      if (
        omit?.includes("input_hidden") &&
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === "hidden"
      ) {
        continue
      }

      groupRetained[node.group] = (groupRetained[node.group] ?? 0) + 1
    }

    const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    for (const [group, count] of Object.entries(groupRetained)) {
      if (count > 0) {
        finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
      }
    }

    return finalGroups
  }, [nodes, omit])

  const entries = useMemo(
    () =>
      (
        Object.entries(groups) as Entries<Record<UiNodeGroupEnum, UiNode[]>>
      ).sort(([a], [b]) => groupSorter(a, b)),
    [groups, groupSorter],
  )

  return {
    groups,
    entries,
  }
}

// Node finder
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
export function useFunctionalNodes(nodes: UiNode[]) {
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
  // @ts-expect-error it's a string array, but typescript thinks the argument must be validated stricter
  return Object.values(UiNodeGroupEnum).includes(method)
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

/** Returns all nodes that are not single sign on nodes (saml, oidc).
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
export function isNodeVisible(node: UiNode): node is UiNodeInput {
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
 * Returns a record of node groups which have at least one visible or interactive element (button,
 * text field, image).
 *
 * Groups which have only hidden or otherwise non-interactive elements (e.g. scripts or
 * hidden input fields) are omitted from the result.
 *
 * @param nodes - Array of nodes to filter on.
 * @returns Record of groups with at least one visible element and their nodes.
 */
export function nodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
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

/**
 * Memoized hook variant of {@link nodeGroupsWithVisibleNodes}.
 *
 * @param nodes - Array of nodes to filter on.
 * @returns Record of groups with at least one visible element and their nodes.
 */
export function useNodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
  return useMemo(() => nodeGroupsWithVisibleNodes(nodes), [nodes])
}

/**
 * The groups that are never offered as selectable authentication methods: SSO groups
 * (oidc, saml) render as separate buttons, and the remaining groups are functional
 * (CSRF, identifier, profile, captcha) rather than authentication methods.
 */
const nonAuthMethodGroups: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Oidc,
  UiNodeGroupEnum.Saml,
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.IdentifierFirst,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Captcha,
]

/**
 * Returns the authentication method groups that have at least one visible node.
 *
 * Groups whose nodes are all hidden (e.g. a passkey group that only carries the
 * browser conditional-UI plumbing) are not returned, because the user cannot select them.
 *
 * This is the single source of truth for "how many auth methods can the user choose
 * from" — the form state shortcut, the method picker, and the footer back-link must
 * all agree on it. SSO groups are excluded because they render as separate buttons
 * on the chooser screen; decisions about skipping or leaving that screen must check
 * {@link hasSingleSignOnNodes} in addition to this count.
 *
 * @param nodes - The nodes to extract the visible auth method groups from.
 */
export function visibleAuthMethodGroups(nodes: UiNode[]): UiNodeGroupEnum[] {
  const visibleGroups = nodeGroupsWithVisibleNodes(nodes)
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter((group) => !nonAuthMethodGroups.includes(group))
}

/**
 * Finds the identifier node for code auth method.
 *
 * @param nodes the UI nodes to filter (usually flow.ui.nodes)
 * @returns the UiNode that corresponds to the identfiier for code method, or undefined if not found
 */
export function findCodeIdentifierNode(
  nodes: UiNode[],
): UiNodeInput | undefined {
  return (findNode(nodes, {
    group: "identifier_first",
    node_type: "input",
    name: "identifier",
  }) ??
    findNode(nodes, {
      group: "code",
      node_type: "input",
      name: "address",
    })) as UiNodeInput | undefined
}

/** The delivery channel used to send a one-time code, either email or SMS. */
export type CodeChannel = "email" | "sms"

// Matches phone numbers in international format, including values that
// Kratos masks with asterisks (e.g. "+4746****87").
const phoneAddressPattern = /^\+[0-9*][0-9 *().-]{3,}$/

function channelFromLabel(label?: UiText): CodeChannel | undefined {
  if (
    label?.id === 1010023 &&
    label.context &&
    typeof label.context === "object" &&
    "channel" in label.context &&
    (label.context.channel === "email" || label.context.channel === "sms")
  ) {
    return label.context.channel
  }
  return undefined
}

/**
 * Classifies a raw address value as email or SMS based on its format.
 *
 * @param value - the address value to classify
 */
function channelFromAddressValue(value: unknown): CodeChannel | undefined {
  if (typeof value !== "string") {
    return undefined
  }
  if (value.includes("@")) {
    return "email"
  }
  if (phoneAddressPattern.test(value.trim())) {
    return "sms"
  }
  return undefined
}

/**
 * Determines the delivery channel of the one-time code method, if it can be
 * inferred from the flow's UI nodes.
 *
 * Kratos attaches the channel to the "Send code to {address}" node label
 * (message 1010023) on second factor and refresh login flows. On
 * identifier-first flows the channel is not part of the payload, so this
 * falls back to the format of the identifier the user typed.
 *
 * @param nodes - the UI nodes of the current flow
 * @returns the inferred delivery channel, or undefined if it cannot be determined
 */
export function findCodeChannel(nodes: UiNode[]): CodeChannel | undefined {
  const identifierNode = findCodeIdentifierNode(nodes)

  const fromIdentifierLabel = channelFromLabel(identifierNode?.meta?.label)
  if (fromIdentifierLabel) {
    return fromIdentifierLabel
  }

  // After the code was sent, Kratos renames the address node to a hidden
  // "identifier" input but keeps its label, so scan all node labels.
  for (const node of nodes) {
    const channel = channelFromLabel(node.meta?.label)
    if (channel) {
      return channel
    }
  }

  const fromIdentifierValue = channelFromAddressValue(
    identifierNode?.attributes.value,
  )
  if (fromIdentifierValue) {
    return fromIdentifierValue
  }

  // On verification flows, once a wrong code is submitted, Kratos clears the
  // flow messages (including the 1010023 label above) and replaces them with
  // an error. The only remaining signal is the resend submit node, which
  // Kratos always names "email" (group "code") even when the address is a
  // phone number, so classify its value the same way as the identifier node.
  // Matching on type "submit" avoids picking up the recovery flow's email
  // text input, which shares the same group and name but echoes raw user
  // input.
  const resendNode = findNode(nodes, {
    node_type: "input",
    group: "code",
    name: "email",
    type: "submit",
  })
  return channelFromAddressValue(resendNode?.attributes.value)
}
