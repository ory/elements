// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { createContext, PropsWithChildren, useContext } from "react"
import { OryFlowComponents } from "../components"
import { defaultNodeSorter } from "./defaultNodeSorter"

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
