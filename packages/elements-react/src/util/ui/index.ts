// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"

import type {
  UiNodeGroupEnum,
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"

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

  // Retry every 250ms for 5 seconds
  let i = 0
  const ms = 250
  const interval = setInterval(() => {
    i++
    if (i > 20) {
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
    console.error(
      "The Ory SDK is missing a required function: window is undefined.",
    )
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  const typedWindow = window as { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!(trigger in typedWindow) || !typedWindow[trigger]) {
    console.error(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const triggerFn = typedWindow[trigger]
  if (typeof triggerFn !== "function") {
    console.error(
      `The Ory SDK is missing a required function: ${trigger}. It is not a function.`,
    )
    return undefined
  }
  return triggerFn as () => void
}
