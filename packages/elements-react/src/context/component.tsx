// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { PropsWithChildren, createContext, useContext } from "react"
import { OryFlowComponents } from "../components"

type ComponentContextValue = {
  components: OryFlowComponents
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

const ComponentContext = createContext<ComponentContextValue>({
  components: null!, // fine because we throw an error if it's not provided
  nodeSorter: () => 0,
  groupSorter: () => 0,
})

/**
 * The `useComponents` hook provides access to the Ory Flow components provided in the `OryComponentProvider`.
 *
 * You can use this hook to access the components defined in the `components` prop of the `OryComponentProvider`.
 *
 * @returns the current component context value.
 * @group Hooks
 */
export function useComponents() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error("useComponents must be used within a ComponentProvider")
  }
  return ctx.components
}

/**
 * The `useNodeSorter` hook provides a way to access the node sorting function
 *
 * The node sorting function is used to determine the order of nodes in a flow based on their attributes and context.
 *
 * To customize the sorting behavior, you can provide a custom `nodeSorter` function to the `OryComponentProvider`.
 *
 * @returns a function that sorts nodes based on the provided context.
 * @group Hooks
 */
export function useNodeSorter() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error("useNodeSorter must be used within a ComponentProvider")
  }
  return ctx.nodeSorter
}

export function useGroupSorter() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error("useGroupSorter must be used within a ComponentProvider")
  }
  return ctx.groupSorter
}

const defaultNodeOrder = [
  "oidc",
  "saml",
  "identifier_first",
  "default",
  "profile",
  "password",
  // CAPTCHA is below password because otherwise the password input field
  // would be above the captcha. Somehow, we sort the password sign up button somewhere else to be always at the bottom.
  "captcha",
  "passkey",
  "code",
  "webauthn",
]

export function defaultNodeSorter(
  a: UiNode,
  b: UiNode,
  // ctx: { flowType: string },
): number {
  // First handle the special case: captcha vs submit button
  const aIsCaptcha = a.group === "captcha"
  const bIsCaptcha = b.group === "captcha"
  const aIsSubmit =
    isUiNodeInputAttributes(a.attributes) && a.attributes.type === "submit"
  const bIsSubmit =
    isUiNodeInputAttributes(b.attributes) && b.attributes.type === "submit"

  // If comparing captcha and submit, always put captcha first
  if (aIsCaptcha && bIsSubmit) {
    return -1 // a (captcha) comes before b (submit)
  }
  if (bIsCaptcha && aIsSubmit) {
    return 1 // b (captcha) comes before a (submit)
  }

  // For all other cases, use the standard group ordering
  const aGroupWeight = defaultNodeOrder.indexOf(a.group) ?? 999
  const bGroupWeight = defaultNodeOrder.indexOf(b.group) ?? 999

  return aGroupWeight - bGroupWeight
}

const defaultGroupOrder: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Password,
  UiNodeGroupEnum.Oidc,
  UiNodeGroupEnum.Code,
  UiNodeGroupEnum.LookupSecret,
  UiNodeGroupEnum.Passkey,
  UiNodeGroupEnum.Webauthn,
  UiNodeGroupEnum.Totp,
]

function defaultGroupSorter(a: UiNodeGroupEnum, b: UiNodeGroupEnum): number {
  const aGroupWeight = defaultGroupOrder.indexOf(a) ?? 999
  const bGroupWeight = defaultGroupOrder.indexOf(b) ?? 999

  return aGroupWeight - bGroupWeight
}

type ComponentProviderProps = {
  components: OryFlowComponents
  nodeSorter?: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter?: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

export function OryComponentProvider({
  children,
  components,
  nodeSorter = defaultNodeSorter,
  groupSorter = defaultGroupSorter,
}: PropsWithChildren<ComponentProviderProps>) {
  return (
    <ComponentContext.Provider
      value={{
        components,
        nodeSorter,
        groupSorter,
      }}
    >
      {children}
    </ComponentContext.Provider>
  )
}
