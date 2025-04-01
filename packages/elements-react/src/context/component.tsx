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

export function useComponents() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error("useComponents must be used within a ComponentProvider")
  }
  return ctx.components
}

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

function defaultNodeSorter(
  a: UiNode,
  b: UiNode,
  // ctx: { flowType: string },
): number {
  const aGroupWeight = defaultNodeOrder.indexOf(a.group) ?? 999
  const bGroupWeight = defaultNodeOrder.indexOf(b.group) ?? 999

  if (
    b.group === "captcha" &&
    isUiNodeInputAttributes(a.attributes) &&
    a.attributes.type === "submit"
  ) {
    // If the current node is a submit button and the next node is CAPTCHA; we sort the captcha before the submit button.
    return aGroupWeight - (bGroupWeight - 2)
  } else if (
    a.group === "captcha" &&
    isUiNodeInputAttributes(b.attributes) &&
    b.attributes.type === "submit"
  ) {
    // If one node is a submit button and the other is CAPTCHA, we sort the captcha before the submit button.
    return aGroupWeight - 2 - bGroupWeight
  }

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
