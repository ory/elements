import { UiNode } from "@ory/client-fetch"
import { PropsWithChildren, createContext, useContext } from "react"
import { OryFlowComponents } from "../components"

type ComponentContextValue = {
  components: OryFlowComponents
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
}

const ComponentContext = createContext<ComponentContextValue>({
  components: null!, // fine because we throw an error if it's not provided
  nodeSorter: () => 0,
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
    throw new Error("useComponents must be used within a ComponentProvider")
  }
  return ctx.nodeSorter
}

const defaultGroupOrder = [
  "oidc",
  "identifier_first",
  "default",
  "profile",
  "password",
  "passkey",
  "code",
  "webauthn",
]

function defaultNodeSorter(
  a: UiNode,
  b: UiNode,
  // ctx: { flowType: string },
): number {
  const aGroupWeight = defaultGroupOrder.indexOf(a.group) ?? 999
  const bGroupWeight = defaultGroupOrder.indexOf(b.group) ?? 999

  return aGroupWeight - bGroupWeight
}

type ComponentProviderProps = {
  components: OryFlowComponents
  nodeSorter?: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
}

export function OryComponentProvider({
  children,
  components,
  nodeSorter = defaultNodeSorter,
}: PropsWithChildren<ComponentProviderProps>) {
  return (
    <ComponentContext.Provider
      value={{
        components,
        nodeSorter,
      }}
    >
      {children}
    </ComponentContext.Provider>
  )
}
