// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiText,
} from "@ory/client-fetch"
import { ComponentType, PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents, useOryFlow } from "../../context"
import {
  OryCardAuthMethodListItemProps,
  OryCardLogoProps,
  OryFormGroupProps,
  OryFormRootProps,
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryNodeAnchorProps,
  OryNodeButtonProps,
  OryNodeCaptchaProps,
  OryNodeConsentScopeCheckboxProps,
  OryNodeImageProps,
  OryNodeInputProps,
  OryNodeLabelProps,
  OryNodeTextProps,
} from "../../types"
import { OryCardFooterProps } from "../card"
import { OryCardRootProps } from "../card/card"
import { OryCardContentProps } from "../card/content"
import { OryPageHeaderProps } from "../generic"
import { OryCardDividerProps } from "../generic/divider"
import {
  OrySettingsSsoProps,
  OrySettingsPasskeyProps,
  OrySettingsRecoveryCodesProps,
  OrySettingsTotpProps,
  OrySettingsWebauthnProps,
} from "../settings"
import { OryMessageContentProps, OryMessageRootProps } from "./messages"
import { OryCardSettingsSectionProps } from "./settings-section"
import { OryFormSsoRootProps, OryNodeSsoButtonProps } from "./social"
import { useOryFormSubmit } from "./useOryFormSubmit"

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
     * The SsoButton component is rendered whenever a button of group "oidc" or "saml" node is encountered.
     *
     * It renders the "Login with Google", "Login with Facebook" etc. buttons.
     */
    SsoButton: ComponentType<OryNodeSsoButtonProps>
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
    /**
     * The Captcha component is rendered whenever a "captcha" group is encountered.
     */
    Captcha: ComponentType<OryNodeCaptchaProps>

    /**
     * Special version of the Input component for scopes in OAuth2 flows.
     */
    ConsentScopeCheckbox: ComponentType<OryNodeConsentScopeCheckboxProps>
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
     * The AuthMethodListContainer component is rendered around the "method" chooser step in the identifier_first login flow.
     *
     * This is only used, if login is configured to use identifier_first authentication.
     */
    AuthMethodListContainer: ComponentType<PropsWithChildren>
    /**
     * The AuthMethodListItem component is rendered on the "method" chooser step in the identifier_first login flow.
     *
     * This is only used, if login is configured to use identifier_first authentication.
     */
    AuthMethodListItem: ComponentType<OryCardAuthMethodListItemProps>

    /**
     * The SettingsSection component is rendered around each section of the settings.
     */
    SettingsSection: ComponentType<OryCardSettingsSectionProps>
    /**
     * The SettingsSectionContent component is rendered around the content of each section of the settings.
     */
    SettingsSectionContent: ComponentType<OryFormSectionContentProps>
    /**
     * The SettingsSectionFooter component is rendered around the footer of each section of the settings.
     */
    SettingsSectionFooter: ComponentType<OryFormSectionFooterProps>
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
    SsoRoot: ComponentType<OryFormSsoRootProps>

    /**
     * The FormGroup is rendered around each group of nodes in the UI nodes.
     */
    Group: ComponentType<OryFormGroupProps>

    /**
     * The section on the settings page, rendering the OIDC settings
     */
    SsoSettings: ComponentType<OrySettingsSsoProps>

    /**
     * The section on the settings page, rendering the Webauthn settings
     */
    WebauthnSettings: ComponentType<OrySettingsWebauthnProps>

    /**
     * The section on the settings page, rendering the Passkey settings
     */
    PasskeySettings: ComponentType<OrySettingsPasskeyProps>

    /**
     * The section on the settings page, rendering the TOTP settings
     */
    TotpSettings: ComponentType<OrySettingsTotpProps>

    /**
     * The section on the settings page, rendering the recovery code settings
     */
    RecoveryCodesSettings: ComponentType<OrySettingsRecoveryCodesProps>
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

    /**
     * The Toast component is rendered for toast messages.
     *
     * Currently only used in the settings page to display messages.
     */
    Toast: ComponentType<OryToastProps>
  }
  Page: {
    Header: ComponentType<OryPageHeaderProps>
  }
}
export type OryToastProps = {
  message: UiText
  id: string | number
}

/**
 * Makes the components in OryFlowComponents optional, so that you can override only the components you want to change.
 */
export type OryFlowComponentOverrides = {
  [P in keyof OryFlowComponents]?: OryFlowComponents[P] extends object
    ? { [K in keyof OryFlowComponents[P]]?: OryFlowComponents[P][K] }
    : OryFlowComponents[P]
}

/**
 * The props for the OryForm component.
 * @inline
 * @hidden
 */
export interface OryFormProps extends PropsWithChildren {
  /**
   * A callback function that is called after the form is submitted.
   *
   * It is always called after the form is submitted, unless the form submission is prevented by client side
   * validation or the API response dictated that the client should be redirected
   *
   * @param method - The method that was submitted.
   */
  onAfterSubmit?: (method: string | number | boolean | undefined) => void
}

/**
 * The OryForm component is the main form container for Ory flows.
 *
 * It renders the form with the correct action and method, and handles the submission of the form.
 *
 * @param props - The props for the OryForm component.
 * @returns
 * @group Components
 */
export function OryForm({ children, onAfterSubmit }: OryFormProps) {
  const { Form } = useComponents()
  const flowContainer = useOryFlow()
  const methods = useFormContext()
  const { Message } = useComponents()

  const intl = useIntl()

  const onSubmit = useOryFormSubmit(onAfterSubmit)

  const hasMethods = flowContainer.flow.ui.nodes.some((node) => {
    if (isUiNodeInputAttributes(node.attributes)) {
      if (node.attributes.type === "hidden") {
        return false
      }
      return node.attributes.name !== "csrf_token"
    } else if (isUiNodeAnchorAttributes(node.attributes)) {
      return true
    } else if (isUiNodeImageAttributes(node.attributes)) {
      return true
    } else if (isUiNodeScriptAttributes(node.attributes)) {
      return true
    }
    return false
  })

  if (!hasMethods) {
    // This is defined in Ory Kratos as well.
    const m: UiText = {
      id: 5000002,
      text: intl.formatMessage({
        id: `identities.messages.${5000002}`,
        defaultMessage:
          "No authentication methods are available for this request. Please contact the site or app owner.",
      }),
      type: "error",
    }

    return (
      <Message.Root>
        <Message.Content key={m.id} message={m} />
      </Message.Root>
    )
  }

  if (
    (flowContainer.flowType === FlowType.Login ||
      flowContainer.flowType === FlowType.Registration) &&
    flowContainer.formState.current === "method_active" &&
    flowContainer.formState.method === "code"
  ) {
    // This is enforced here because method code node is sometimes missing
    methods.setValue("method", "code")
  }

  return (
    <Form.Root
      action={flowContainer.flow.ui.action}
      method={flowContainer.flow.ui.method}
      onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
    >
      {children}
    </Form.Root>
  )
}
