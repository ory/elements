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
  nodes: Array<UiNode>
  groups?: Array<UiNodeGroupEnum | string> | UiNodeGroupEnum | string
  withoutDefaultGroup?: boolean
  attributes?:
    | Array<UiNodeInputAttributesTypeEnum | string>
    | UiNodeInputAttributesTypeEnum
    | string
  withoutDefaultAttributes?: boolean
  excludeAttributes?:
    | Array<UiNodeInputAttributesTypeEnum | string>
    | UiNodeInputAttributesTypeEnum
    | string
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

  // Retry ever 50ms for 5 seconds
  let i = 0
  const ms = 100
  const interval = setInterval(() => {
    i++
    if (i > (5 * 60 * 1000) / ms) {
      clearInterval(interval)
      throw new Error(
        "Unable to load Ory's WebAuthn script. Is it being blocked or is otherwise failing to load? If you are running an old version of Ory Elements, please upgrade. For more information, please check your browser's developer console.",
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
  if (!window[trigger]) {
    console.error(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }
  return window[trigger]
}
