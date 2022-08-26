import {
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceVerificationFlowBody,
} from "@ory/client"
import React, { FormEvent } from "react"
import { SelfServiceFlow } from "../../types"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type SelfServiceFlowFormAdditionalProps = {
  onSubmit?: ({
    body,
    event,
  }: {
    body:
      | SubmitSelfServiceLoginFlowBody
      | SubmitSelfServiceRegistrationFlowBody
      | SubmitSelfServiceRecoveryFlowBody
      | SubmitSelfServiceVerificationFlowBody
    event?: React.FormEvent<HTMLFormElement>
  }) => void
}

// SelfServiceFlowForm props
export interface SelfServiceFlowFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    SelfServiceFlowFormAdditionalProps {
  flow: SelfServiceFlow
  children: React.ReactNode
  submitOnEnter?: boolean
  className?: string
}

export const SelfServiceFlowForm = ({
  flow,
  children,
  submitOnEnter,
  onSubmit,
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
    {...(onSubmit && {
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        // map the entire form data to JSON for the request body
        const body = Object.fromEntries(formData) as never as
          | SubmitSelfServiceLoginFlowBody
          | SubmitSelfServiceRegistrationFlowBody
          | SubmitSelfServiceRecoveryFlowBody
          | SubmitSelfServiceVerificationFlowBody

        // We need the method from which is specified as a name and value on the submit button
        body.method = (
          event.currentTarget.elements.namedItem("method") as HTMLInputElement
        ).value

        onSubmit({ body, event })
      },
    })}
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
