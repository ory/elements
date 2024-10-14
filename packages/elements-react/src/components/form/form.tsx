// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { ComponentType, PropsWithChildren } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { useIntl } from "react-intl"
import { useOryFlow, useComponents } from "../../context"
import {
  FormValues,
  HeadlessAuthMethodListItemProps,
  HeadlessButtonProps,
  HeadlessCurrentIdentifierProps,
  HeadlessFormProps,
  HeadlessImageProps,
  HeadlessInputProps,
  HeadlessLabelProps,
  HeadlessLinkButtonProps,
  HeadlessTextProps,
} from "../../types"
import { HorizontalDividerProps } from "../generic/divider"
import { HeadlessGroupContainerProps, OryFormGroups } from "./groups"
import { HeadlessMessageProps, HeadlessMessagesProps } from "./messages"
import {
  HeadlessSocialButtonContainerProps,
  HeadlessSocialButtonProps,
  OryFormSocialButtons,
} from "./social"
import {
  FlowType,
  OnRedirectHandler,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
} from "@ory/client-fetch"
import {
  FlowContainer,
  onSubmitLogin,
  onSubmitRecovery,
  onSubmitRegistration,
  onSubmitSettings,
  onSubmitVerification,
} from "../../util"
import { computeDefaultValues } from "./form-helpers"

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
  CurrentIdentifierButton: ComponentType<HeadlessCurrentIdentifierProps>
}

export type OryFormProps = PropsWithChildren

export function OryForm({ children }: OryFormProps) {
  const { FormContainer } = useComponents()
  const flowContainer = useOryFlow()
  const methods = useForm({
    // TODO: Generify this, so we have typesafety in the submit handler.
    defaultValues: computeDefaultValues(flowContainer),
  })

  const intl = useIntl()

  const onRedirect: OnRedirectHandler = (url, external) => {
    if (external) {
      window.location.href = url
      return
    }

    // TODO(jonas): this should somehow be overridable by the user to allow next js specific redirects, or other frameworks.
    window.location.href = url
  }

  const handleSuccess = (flow: FlowContainer) => {
    flowContainer.setFlowContainer(flow)
    methods.reset(computeDefaultValues(flow))
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    switch (flowContainer.flowType) {
      case FlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(data as unknown as UpdateLoginFlowBody),
        }
        if (submitData.method === "code" && data.code) {
          submitData.resend = ""
        }
        console.log(submitData)
        await onSubmitLogin(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
        })
        break
      }
      case FlowType.Registration: {
        const submitData: UpdateRegistrationFlowBody = {
          ...(data as unknown as UpdateRegistrationFlowBody),
        }

        if (submitData.method === "code" && submitData.code) {
          submitData.resend = ""
        }

        await onSubmitRegistration(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
        })
        break
      }
      case FlowType.Verification:
        await onSubmitVerification(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: data as unknown as UpdateVerificationFlowBody,
        })
        break
      case FlowType.Recovery: {
        const submitData: UpdateRecoveryFlowBody = {
          ...(data as unknown as UpdateRecoveryFlowBody),
        }
        // TODO: We should probably fix this in Kratos, and give the code priority over the email. However, that would be breaking :(
        if (data.code) {
          submitData.email = ""
        }
        await onSubmitRecovery(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
        })
        break
      }
      case FlowType.Settings:
        await onSubmitSettings(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: data as unknown as UpdateSettingsFlowBody,
        })
        break
    }
  }

  const hasMethods =
    flowContainer.flow.ui.nodes.filter((node) => {
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

  if (!hasMethods && (flowContainer.flow.ui.messages ?? []).length === 0) {
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
        action={flowContainer.flow.ui.action}
        method={flowContainer.flow.ui.method}
        onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
      >
        {children ?? (
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
