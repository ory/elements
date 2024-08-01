import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react"
import { FlowContainer } from "../util/flowContainer"

/**
 * Returns an object that contains the current flow and the flow type, as well as the configuration.
 *
 * @returns The current flow container
 */
export function useOryFlow() {
  const ctx = useContext(OryFlowContext)
  if (!ctx) {
    throw new Error("useOryFlow must be used within a OryFlowProvider")
  }

  return ctx
}

export type FlowContainerSetter = Dispatch<Partial<FlowContainer>>

export type FlowContextValue = FlowContainer & {
  setFlowContainer: FlowContainerSetter
}

// This is fine, because we don't export the context itself and guard from it being null in useOryFlow
const OryFlowContext = createContext<FlowContextValue>(null!)

export type OryFlowProviderProps = PropsWithChildren<FlowContainer>

export function OryFlowProvider({
  children,
  ...container
}: OryFlowProviderProps) {
  const [flowContainer, setFlowContainer] = useState(container)

  return (
    <OryFlowContext.Provider
      value={
        {
          ...flowContainer,
          setFlowContainer: (updatedContainer) => {
            setFlowContainer(
              (container) =>
                ({
                  ...container,
                  ...updatedContainer,
                }) as FlowContainer,
            )
          },
        } as FlowContextValue
      }
    >
      {children}
    </OryFlowContext.Provider>
  )
}
