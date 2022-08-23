import React from "react"
import { SelfServiceFlow } from "../../types"
import { FilterFlowNodes } from "./filter-flow-nodes"

// SelfServiceFlowForm props
export interface SelfServiceFlowFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  flow: SelfServiceFlow
  children: React.ReactNode
  submitOnEnter?: boolean
  className?: string
}

export const SelfServiceFlowForm = ({
  flow,
  children,
  submitOnEnter,
  className,
}: SelfServiceFlowFormProps): JSX.Element => (
  <form
    className={className}
    action={flow.ui.action}
    method={flow.ui.method}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !submitOnEnter) {
        e.stopPropagation()
        e.preventDefault()
      }
    }}
  >
    <>
      {/*always add csrf token and other hidden fields to form*/}
      <FilterFlowNodes
        filter={{
          nodes: flow.ui.nodes,
          attributes: "hidden",
        }}
        includeCSRF={true}
      />
      {children}
    </>
  </form>
)
