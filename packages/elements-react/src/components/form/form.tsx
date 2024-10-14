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
  OryCardAuthMethodListItemProps,
  OryNodeButtonProps,
  OryFormRootProps,
  OryNodeImageProps,
  OryNodeInputProps,
  OryNodeLabelProps,
  OryNodeAnchorProps,
  OryNodeTextProps,
  OryCurrentIdentifierProps,
  OryCardLogoProps,
} from "../../types"
import { OryCardDividerProps } from "../generic/divider"
import { OryFormGroupProps, OryFormGroups } from "./groups"
import { OryMessageContentProps, OryMessageRootProps } from "./messages"
import {
  OryFormOidcRootProps,
  OryNodeOidcButtonProps,
  OryFormOidcButtons,
} from "./social"
import {
  FlowType,
  OnRedirectHandler,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
} from "@ory/client-fetch"
import { OryFlowContainer } from "../../util"
import { computeDefaultValues } from "./form-helpers"
import { OryCardRootProps } from "../card/card"
import { OryCardFooterProps } from "../card"
import { OryCardContentProps } from "../card/content"
import { onSubmitLogin } from "../../util/onSubmitLogin"
import { onSubmitRegistration } from "../../util/onSubmitRegistration"
import { onSubmitVerification } from "../../util/onSubmitVerification"
import { onSubmitRecovery } from "../../util/onSubmitRecovery"
import { onSubmitSettings } from "../../util/onSubmitSettings"

/**
 * A record of all the components that are used in the OryForm component.
 */
export type OryFlowComponents = {
  Node: {
    /**
     * Button component, rendered whenever a button is encountered in the Ory UI Nodes.
     */
    Button: ComponentType<OryNodeButtonProps>
    /**
     * The SocialButton component is rendered whenever a button of group "oidc" node is encountered.
     *
     * It renders the "Login with Google", "Login with Facebook" etc. buttons.
     */
    OidcButton: ComponentType<OryNodeOidcButtonProps>
    /**
     * The CurrentIdentifierButton component is rendered whenever a button of group "identifier_first" node is encountered.
     *
     * It is used to show the current identifier and can allow the user to start a new flow, if they want to.
     */
    CurrentIdentifierButton: ComponentType<OryCurrentIdentifierProps>
    /**
     * Anchor component, rendered whenever an "anchor" node is encountered
     */
    Anchor: ComponentType<OryNodeAnchorProps>
    /**
     * The Input component is rendered whenever a "input" node is encountered.
     */
    Input: ComponentType<OryNodeInputProps>
    /**
     * Special version of the Input component for OTP codes.
     */
    CodeInput: ComponentType<OryNodeInputProps>
    /**
     * The Image component is rendered whenever an "image" node is encountered.
     *
     * For example used in the "Logo" node.
     */
    Image: ComponentType<OryNodeImageProps>
    /**
     * The Label component is rendered around Input components and is used to render form labels.
     */
    Label: ComponentType<OryNodeLabelProps>
    /**
     * The Checkbox component is rendered whenever an input node with of boolean type is encountered.
     */
    Checkbox: ComponentType<OryNodeInputProps>
    /**
     * The Text component is rendered whenever a "text" node is encountered.
     */
    Text: ComponentType<OryNodeTextProps>
  }
  Card: {
    /**
     * The card container is the main container of the card.
     */
    Root: ComponentType<OryCardRootProps>
    /**
     * The card footer is the footer of the card container.
     */
    Footer: ComponentType<OryCardFooterProps>
    /**
     * The card header is the header of the card container.
     */
    Header: ComponentType<OryCardRootProps>
    /**
     * The card content is the main content of the card container.
     */
    Content: ComponentType<OryCardContentProps>
    /**
     * The card logo is the logo of the card container.
     */
    Logo: ComponentType<OryCardLogoProps>
    /**
     * The HorizontalDivider component is rendered between groups.
     */
    Divider: ComponentType<OryCardDividerProps>
    /**
     * The AuthMethodListItem component is rendered on the "method" chooser step in the identifier_first login flow.
     *
     * This is only used, if login is configured to use identifier_first authentication.
     */
    AuthMethodListItem: ComponentType<OryCardAuthMethodListItemProps>
  }
  Form: {
    /**
     * The FormContainer component is the main container of the form.
     *
     * It should render its children.
     *
     * You most likely don't want to override this component directly.
     */
    Root: ComponentType<OryFormRootProps>
    /**
     * A special form group container for the social buttons.
     *
     * This is required, because the social buttons need to be in its form, to not influence the other form groups.
     *
     * You most likely don't want to override this component directly.
     */
    OidcRoot: ComponentType<OryFormOidcRootProps>

    /**
     * The FormGroup is rendered around each group of nodes in the UI nodes.
     */
    Group: ComponentType<OryFormGroupProps>
  }
  Message: {
    /**
     * The MessageContainer is rendered around the messages.
     */
    Root: ComponentType<OryMessageRootProps>

    /**
     * The Message component is rendered whenever a message is encountered.
     */
    Content: ComponentType<OryMessageContentProps>
  }
}

type DeepPartialTwoLevels<T> = {
  [P in keyof T]?: T[P] extends object ? { [K in keyof T[P]]?: T[P][K] } : T[P]
}

export type OryFlowComponentOverrides = DeepPartialTwoLevels<OryFlowComponents>

export type OryFormProps = PropsWithChildren

export function OryForm({ children }: OryFormProps) {
  const { Form } = useComponents()
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

  const handleSuccess = (flow: OryFlowContainer) => {
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
      <Form.Root
        action={flowContainer.flow.ui.action}
        method={flowContainer.flow.ui.method}
        onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
      >
        {children ?? (
          <>
            <OryFormOidcButtons />
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
      </Form.Root>
    </FormProvider>
  )
}
