import { HeadlessGroupContainerProps, OryFormGroups } from "./groups"
import { HeadlessMessageProps, HeadlessMessagesProps } from "./messages"
import {
  HeadlessSocialButtonContainerProps,
  HeadlessSocialButtonProps,
  OryFormSocialButtons,
} from "./social"
import { HorizontalDividerProps } from "../generic/divider"
import { useComponents } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"
import { OnRedirectHandler } from "../../hooks/utils"
import {
  FormValues,
  HeadlessAuthMethodListItemProps,
  HeadlessButtonProps,
  HeadlessFormProps,
  HeadlessImageProps,
  HeadlessInputProps,
  HeadlessLabelProps,
  HeadlessLinkButtonProps,
  HeadlessTextProps,
} from "../../types"
import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import {
  FlowType,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  onSubmitLogin,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitSettings,
  onSubmitVerification,
} from "@ory/client-helpers"
import { RedirectType, redirect } from "next/navigation"
import { ComponentType, PropsWithChildren } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useIntl } from "react-intl"

export type OryFormComponents = {
  Button: ComponentType<HeadlessButtonProps>
  LinkButton: ComponentType<HeadlessLinkButtonProps>
  Input: ComponentType<HeadlessInputProps>
  PinCodeInput: ComponentType<HeadlessInputProps>
  Image: ComponentType<HeadlessImageProps>
  Label: ComponentType<HeadlessLabelProps>
  Checkbox: ComponentType<HeadlessInputProps>
  Text: ComponentType<HeadlessTextProps>

  FormContainer: ComponentType<HeadlessFormProps>

  SocialButton: ComponentType<HeadlessSocialButtonProps>
  SocialButtonContainer: ComponentType<HeadlessSocialButtonContainerProps>

  AuthMethodListItem: ComponentType<HeadlessAuthMethodListItemProps>

  HorizontalDivider: ComponentType<HorizontalDividerProps>

  FormGroup: ComponentType<HeadlessGroupContainerProps>

  MessageContainer: ComponentType<HeadlessMessagesProps>
  Message: ComponentType<HeadlessMessageProps>
  CurrentIdentifierButton: ComponentType<HeadlessButtonProps>
}

export type OryFormProps = PropsWithChildren<{}>

export function OryForm({ children }: OryFormProps) {
  const { FormContainer } = useComponents()
  const flowContainer = useOryFlow()
  const { flow, flowType, setFlowContainer } = flowContainer

  const methods = useForm({
    defaultValues: flow.ui.nodes.reduce<FormValues>((acc, node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        if (node.attributes.name === "method") {
          // Do not set the default values for this.
          return acc
        }
        acc[node.attributes.name] = node.attributes.value
      }

      return acc
    }, {}),
  })
  const intl = useIntl()

  const onRedirect: OnRedirectHandler = (url, external) => {
    if (external) {
      window.location.href = url
      return
    }

    redirect(url, RedirectType.push)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    switch (flowType) {
      case FlowType.Login:
        await onSubmitLogin(flowContainer, {
          onRedirect,
          setFlowContainer: setFlowContainer,
          body: data as unknown as UpdateLoginFlowBody,
        })
        break
      case FlowType.Registration:
        await onSubmitRegistration(flowContainer, {
          onRedirect,
          setFlowContainer: setFlowContainer,
          body: data as unknown as UpdateRegistrationFlowBody,
        })
        break
      case FlowType.Verification:
        await onSubmitVerification(flowContainer, {
          onRedirect,
          setFlowContainer: setFlowContainer,
          body: data as unknown as UpdateVerificationFlowBody,
        })
        break
      case FlowType.Recovery:
        const submitData: UpdateRecoveryFlowBody = {
          ...(data as unknown as UpdateRecoveryFlowBody),
        }
        // TODO: We should probably fix this in Kratos, and give the code priority over the email. However, that would be breaking :(
        if (data.code) {
          submitData.email = ""
        }
        await onSubmitRecovery(flowContainer, {
          onRedirect,
          setFlowContainer: setFlowContainer,
          body: submitData,
        })
        break
      case FlowType.Settings:
        await onSubmitSettings(flowContainer, {
          onRedirect,
          setFlowContainer: setFlowContainer,
          body: data as unknown as UpdateSettingsFlowBody,
        })
        break
    }
  }

  const hasMethods =
    flow.ui.nodes.filter((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        return node.attributes.name !== "csrf_token"
      } else if (isUiNodeAnchorAttributes(node.attributes)) {
        return true
      } else if (isUiNodeImageAttributes(node.attributes)) {
        return true
      } else if (isUiNodeScriptAttributes(node.attributes)) {
        return true
      }

      return false
    }).length > 0

  if (!hasMethods && (flow.ui.messages ?? []).length === 0) {
    // This is defined in Ory Kratos as well.
    return intl.formatMessage({
      id: `identities.messages.${5000002}`,
      defaultMessage:
        "No authentication methods are available for this request. Please contact the site or app owner.",
    })
  }

  return (
    <FormProvider {...methods}>
      <FormContainer
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children || (
          <>
            <OryFormSocialButtons />
            <OryFormGroups
              groups={[
                "default",
                "password",
                "code",
                "webauthn",
                "passkey",
                "identifier_first",
              ]}
            />
          </>
        )}
      </FormContainer>
    </FormProvider>
  )
}
