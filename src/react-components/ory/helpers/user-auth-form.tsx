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

        console.dir({ elements: event.currentTarget.elements })

        const method = event.currentTarget.elements.namedItem("method")

        const lookupSecretRegenerate = event.currentTarget.elements.namedItem(
          "lookup_secret_regenerate",
        )

        const lookupSecretsConfirm = event.currentTarget.elements.namedItem(
          "lookup_secret_confirm",
        )

        const lookupSecretsReveal = event.currentTarget.elements.namedItem(
          "lookup_secret_reveal",
        )

        const lookupSecretsDisable = event.currentTarget.elements.namedItem(
          "lookup_secret_disable",
        )

        const totpUnlink = event.currentTarget.elements.namedItem("totp_unlink")

        if (totpUnlink) {
          body = {
            ...body,
            totp_unlink: true,
          }
        }

        if (lookupSecretRegenerate) {
          body = {
            ...body,
            lookup_secret_regenerate: true,
          }
        }

        if (lookupSecretsConfirm) {
          body = {
            ...body,
            lookup_secret_confirm: true,
          }
        }

        if (lookupSecretsReveal) {
          body = {
            ...body,
            lookup_secret_reveal: true,
          }
        }

        if (lookupSecretsDisable) {
          body = {
            ...body,
            lookup_secret_disable: true,
          }
        }

        if (method) {
          // We need the method from which is specified as a name and value on the submit button
          body.method = (method as HTMLInputElement).value
        }

        console.dir({ body })

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
