import React from "react"
import {
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
} from "@ory/client"
import { SelfServiceFlow } from "./types"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type UserAuthFormAdditionalProps = {
  onSubmit?: ({
    body,
    event,
  }: {
    body:
      | SubmitSelfServiceLoginFlowBody
      | SubmitSelfServiceRegistrationFlowBody
      | SubmitSelfServiceRecoveryFlowBody
      | SubmitSelfServiceVerificationFlowBody
      | SubmitSelfServiceSettingsFlowBody
    event?: React.FormEvent<HTMLFormElement>
  }) => void
}

// SelfServiceFlowForm props
export interface UserAuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    UserAuthFormAdditionalProps {
  flow: SelfServiceFlow
  children: React.ReactNode
  submitOnEnter?: boolean
  className?: string
}

export const UserAuthForm = ({
  flow,
  children,
  submitOnEnter,
  onSubmit,
  className,
  ...props
}: UserAuthFormProps): JSX.Element => (
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
        let body = Object.fromEntries(formData) as unknown as
          | SubmitSelfServiceLoginFlowBody
          | SubmitSelfServiceRegistrationFlowBody
          | SubmitSelfServiceRecoveryFlowBody
          | SubmitSelfServiceVerificationFlowBody
          | SubmitSelfServiceSettingsFlowBody

        // We need the method specified from the name and value of the submit button.
        // when multiple submit buttons are present, the clicked one's value is used.
        if ("submitter" in event.nativeEvent) {
          const method = (
            event.nativeEvent as unknown as { submitter: HTMLInputElement }
          ).submitter
          body = {
            ...body,
            ...{ [method.name]: method.value },
          }
        }

        onSubmit({ body, event })
      },
    })}
    {...props}
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
