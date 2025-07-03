// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFlowComponentOverrides,
  OryFlowComponents,
} from "@ory/elements-react"
import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from "./card"
import { DefaultAuthMethodListItem } from "./card/auth-method-list-item"
import {
  DefaultFormContainer,
  DefaultMessage,
  DefaultMessageContainer,
} from "./form"
import { DefaultButton } from "./form/button"
import { DefaultCheckbox } from "./form/checkbox"
import { DefaultGroupContainer } from "./form/group-container"
import { DefaultHorizontalDivider } from "./form/horizontal-divider"
import { DefaultImage } from "./form/image"
import { DefaultInput } from "./form/input"
import { DefaultLabel } from "./form/label"
import { DefaultLinkButton } from "./form/link-button"
import { DefaultPinCodeInput } from "./form/pin-code-input"
import {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
} from "./form/section"
import { DefaultButtonSocial, DefaultSocialButtonContainer } from "./form/sso"
import { DefaultText } from "./form/text"
import { DefaultPageHeader } from "./generic/page-header"
import { DefaultSettingsOidc } from "./settings/settings-oidc"
import { DefaultSettingsPasskey } from "./settings/settings-passkey"
import { DefaultSettingsRecoveryCodes } from "./settings/settings-recovery-codes"
import { DefaultSettingsTotp } from "./settings/settings-totp"
import { DefaultSettingsWebauthn } from "./settings/settings-webauthn"
import { DefaultAuthMethodListContainer } from "./card/auth-method-list-container"
import { DefaultCaptcha } from "./form/captcha"
import { DefaultConsentScopeCheckbox } from "./form/consent-scope-checkbox"
import { DefaultToast } from "./generic/toast"

/**
 * Merges the default Ory components with any provided overrides.
 *
 * The output of this function is a complete set of components that can be used in Ory flows.
 *
 * @param overrides - Optional overrides for the default components.
 * @returns
 *
 * @category Utilities
 */
export function getOryComponents(
  overrides?: OryFlowComponentOverrides,
): OryFlowComponents {
  // Yes, this could probably be easier by using lodash or a custom merge function.
  // But, this makes it very explicit what can be overridden, and does not introduce issues with merging nested fields.
  return {
    Card: {
      Root: overrides?.Card?.Root ?? DefaultCard,
      Footer: overrides?.Card?.Footer ?? DefaultCardFooter,
      Header: overrides?.Card?.Header ?? DefaultCardHeader,
      Content: overrides?.Card?.Content ?? DefaultCardContent,
      Logo: overrides?.Card?.Logo ?? DefaultCardLogo,
      Divider: overrides?.Card?.Divider ?? DefaultHorizontalDivider,
      AuthMethodListContainer:
        overrides?.Card?.AuthMethodListContainer ??
        DefaultAuthMethodListContainer,
      AuthMethodListItem:
        overrides?.Card?.AuthMethodListItem ?? DefaultAuthMethodListItem,
      SettingsSection: overrides?.Card?.SettingsSection ?? DefaultFormSection,
      SettingsSectionContent:
        overrides?.Card?.SettingsSectionContent ?? DefaultFormSectionContent,
      SettingsSectionFooter:
        overrides?.Card?.SettingsSectionFooter ?? DefaultFormSectionFooter,
    },
    Node: {
      Button: overrides?.Node?.Button ?? DefaultButton,
      SsoButton: overrides?.Node?.SsoButton ?? DefaultButtonSocial,
      Input: overrides?.Node?.Input ?? DefaultInput,
      CodeInput: overrides?.Node?.CodeInput ?? DefaultPinCodeInput,
      Image: overrides?.Node?.Image ?? DefaultImage,
      Label: overrides?.Node?.Label ?? DefaultLabel,
      Checkbox: overrides?.Node?.Checkbox ?? DefaultCheckbox,
      Text: overrides?.Node?.Text ?? DefaultText,
      Anchor: overrides?.Node?.Anchor ?? DefaultLinkButton,
      Captcha: overrides?.Node?.Captcha ?? DefaultCaptcha,
      ConsentScopeCheckbox:
        overrides?.Node?.ConsentScopeCheckbox ?? DefaultConsentScopeCheckbox,
    },
    Form: {
      Root: overrides?.Form?.Root ?? DefaultFormContainer,
      Group: overrides?.Form?.Group ?? DefaultGroupContainer,
      SsoRoot: overrides?.Form?.SsoRoot ?? DefaultSocialButtonContainer,
      RecoveryCodesSettings:
        overrides?.Form?.RecoveryCodesSettings ?? DefaultSettingsRecoveryCodes,
      TotpSettings: overrides?.Form?.TotpSettings ?? DefaultSettingsTotp,
      SsoSettings: overrides?.Form?.SsoSettings ?? DefaultSettingsOidc,
      WebauthnSettings:
        overrides?.Form?.WebauthnSettings ?? DefaultSettingsWebauthn,
      PasskeySettings:
        overrides?.Form?.PasskeySettings ?? DefaultSettingsPasskey,
    },
    Message: {
      Root: overrides?.Message?.Root ?? DefaultMessageContainer,
      Content: overrides?.Message?.Content ?? DefaultMessage,
      Toast: overrides?.Message?.Toast ?? DefaultToast,
    },
    Page: {
      Header: overrides?.Page?.Header ?? DefaultPageHeader,
    },
  }
}
