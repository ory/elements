// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"

import type {
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { useMemo } from "react"
import { useGroupSorter } from "../../context/component"

export function capitalize(s: string) {
  if (!s) {
    return s
  }
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export type FilterNodesByGroups = {
  nodes: UiNode[]
  groups?: UiNodeGroupEnum[] | UiNodeGroupEnum
  withoutDefaultGroup?: boolean
  attributes?: UiNodeInputAttributesTypeEnum[] | UiNodeInputAttributesTypeEnum
  withoutDefaultAttributes?: boolean
  excludeAttributes?:
    | UiNodeInputAttributesTypeEnum[]
    | UiNodeInputAttributesTypeEnum
}

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

function triggerToFunction(
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
            ...excludeAuthMethods,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )
}

/**
 * Groups nodes by their group and returns an object with the groups and entries.
 *
 * @param nodes - The nodes to group
 */
export function useNodesGroups(nodes: UiNode[]) {
  const groupSorter = useGroupSorter()

  const groups = useMemo(() => {
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

    return groups
  }, [nodes])

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
