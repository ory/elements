import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client"
import { FilterNodesByGroups } from "@ory/integrations/ui"
import cn from "classnames"
import { JSX } from "react"

import { formStyle } from "../../../theme"
import { CustomOnSubmit, CustomOnSubmitCallback } from "./common"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlow } from "./types"

/**
 * Additional props that can be passed to the UserAuthForm component
 * @see UserAuthForm
 *
 * @param onSubmit - function that is called when the form is submitted. It automatically maps the form data to the request body and prevents native form submits.
 */
export type UpdateBody =
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateVerificationFlowBody
  | UpdateSettingsFlowBody

export interface UserAuthFormAdditionalProps = {
  onSubmit ?: CustomOnSubmitCallback<UpdateBody>
}

/**
 * UserAuthFormProps is the props interface for the UserAuthForm component
 * @see UserAuthForm
 *
 * @param flow - the Ory flow object that is used to add the form action and method and add csrf tokens to the form
 * @param children - the children of the form
 * @param formFilterOverride - the filter that is used to filter the form nodes. By default, only hidden fields are included.
 * @param submitOnEnter - if true, the form will be submitted when the enter key is pressed. Otherwise, the enter key will be ignored.
 * @param className - css class overrides for the form component
 */
export interface UserAuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
  UserAuthFormAdditionalProps {
  flow: SelfServiceFlow
  children: React.ReactNode
  formFilterOverride?: FilterNodesByGroups
  submitOnEnter?: boolean
  className?: string
}

/**
 * UserAuthForm is a component that renders a form for a given Ory flow.
 * It automatically adds the form action and method and adds csrf tokens to the form.
 * When the `onSubmit` parameter is passed, it also automatically maps the form data to the request body and prevents native form submits.
 * @see UserAuthFormProps
 * @returns JSX.Element
 */
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
        CustomOnSubmit<UpdateBody>(event, onSubmit)
      },
    })}
    {...props}
  >
    <>
      {/*always add csrf token and other hidden fields to form*/}
      <FilterFlowNodes
        filter={
          formFilterOverride ?? {
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
