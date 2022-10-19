import {
  SubmitSelfServiceLoginFlowBody,
  SubmitSelfServiceRecoveryFlowBody,
  SubmitSelfServiceRegistrationFlowBody,
  SubmitSelfServiceSettingsFlowBody,
  SubmitSelfServiceVerificationFlowBody,
} from "@ory/client"
import { FilterNodesByGroups } from "@ory/integrations/ui"
import cn from "classnames"
import React from "react"
import { formStyle } from "../../../theme"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlow } from "./types"

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
  formFilterOverride?: FilterNodesByGroups
  submitOnEnter?: boolean
  className?: string
}

export const UserAuthForm = ({
  flow,
  children,
  submitOnEnter,
  onSubmit,
  formFilterOverride,
  className,
  ...props
}: UserAuthFormProps): JSX.Element => (
  <form
    className={cn(className, formStyle)}
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
        filter={
          formFilterOverride || {
            nodes: flow.ui.nodes,
            groups: "default", // we only want to map hidden default fields here
            attributes: "hidden",
          }
        }
        includeCSRF={true}
      />
      {children}
    </>
  </form>
)
