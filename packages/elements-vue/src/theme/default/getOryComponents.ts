// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type {
  OryFlowComponents,
  OryFlowComponentOverrides,
} from "../../composables/useComponents"
import {
  DefaultCard,
  DefaultCardHeader,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardLogo,
  DefaultAuthMethodListContainer,
  DefaultAuthMethodListItem,
} from "./components/card"
import {
  DefaultFormContainer,
  DefaultGroupContainer,
  DefaultInput,
  DefaultButton,
  DefaultCheckbox,
  DefaultText,
  DefaultImage,
  DefaultAnchor,
  DefaultLabel,
  DefaultSsoButton,
  DefaultSsoButtonContainer,
  DefaultCodeInput,
  DefaultCaptcha,
  DefaultConsentCheckbox,
  DefaultDivider,
  DefaultMessageContainer,
  DefaultMessage,
  DefaultSettingsSection,
  DefaultSettingsSectionContent,
  DefaultSettingsSectionFooter,
} from "./components/form"
import { DefaultPageHeader, DefaultToast } from "./components/ui"
import {
  DefaultSettingsTotp,
  DefaultSettingsWebauthn,
  DefaultSettingsPasskey,
  DefaultSettingsOidc,
  DefaultSettingsRecoveryCodes,
} from "./components/settings"

/**
 * Merges the default Ory components with any provided overrides.
 *
 * @param overrides - Optional overrides for the default components.
 */
export function getOryComponents(
  overrides?: OryFlowComponentOverrides,
): OryFlowComponents {
  return {
    Card: {
      Root: overrides?.Card?.Root ?? DefaultCard,
      Footer: overrides?.Card?.Footer ?? DefaultCardFooter,
      Header: overrides?.Card?.Header ?? DefaultCardHeader,
      Content: overrides?.Card?.Content ?? DefaultCardContent,
      Logo: overrides?.Card?.Logo ?? DefaultCardLogo,
      Divider: overrides?.Card?.Divider ?? DefaultDivider,
      AuthMethodListContainer:
        overrides?.Card?.AuthMethodListContainer ??
        DefaultAuthMethodListContainer,
      AuthMethodListItem:
        overrides?.Card?.AuthMethodListItem ?? DefaultAuthMethodListItem,
      SettingsSection:
        overrides?.Card?.SettingsSection ?? DefaultSettingsSection,
      SettingsSectionContent:
        overrides?.Card?.SettingsSectionContent ??
        DefaultSettingsSectionContent,
      SettingsSectionFooter:
        overrides?.Card?.SettingsSectionFooter ?? DefaultSettingsSectionFooter,
    },
    Node: {
      Button: overrides?.Node?.Button ?? DefaultButton,
      SsoButton: overrides?.Node?.SsoButton ?? DefaultSsoButton,
      Input: overrides?.Node?.Input ?? DefaultInput,
      CodeInput: overrides?.Node?.CodeInput ?? DefaultCodeInput,
      Image: overrides?.Node?.Image ?? DefaultImage,
      Label: overrides?.Node?.Label ?? DefaultLabel,
      Checkbox: overrides?.Node?.Checkbox ?? DefaultCheckbox,
      Text: overrides?.Node?.Text ?? DefaultText,
      Anchor: overrides?.Node?.Anchor ?? DefaultAnchor,
      Captcha: overrides?.Node?.Captcha ?? DefaultCaptcha,
      ConsentScopeCheckbox:
        overrides?.Node?.ConsentScopeCheckbox ?? DefaultConsentCheckbox,
    },
    Form: {
      Root: overrides?.Form?.Root ?? DefaultFormContainer,
      Group: overrides?.Form?.Group ?? DefaultGroupContainer,
      SsoRoot: overrides?.Form?.SsoRoot ?? DefaultSsoButtonContainer,
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
