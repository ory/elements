// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from "./card"
import { DefaultAuthMethodListItem } from "./card/auth-methods"
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
  DefaultButtonSocial,
  DefaultSocialButtonContainer,
} from "./form/social"
import { DefaultText } from "./form/text"
import { DefaultCurrentIdentifierButton } from "./card/current-identifier-button"
import { OryFlowComponents } from "@ory/elements-react"
import {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
} from "./form/section"
import { DefaultSettingsRecoveryCodes } from "./settings/settings-recovery-codes"
import { DefaultSettingsTotp } from "./settings/settings-top"
import { DefaultSettingsOidc } from "./settings/settings-oidc"
import { DefaultSettingsWebauthn } from "./settings/settings-webauthn"
import { DefaultSettingsPasskey } from "./settings/settings-passkey"
import { DefaultPageHeader } from "./generic/page-header"

export const OryDefaultComponents: OryFlowComponents = {
  Card: {
    Root: DefaultCard,
    Footer: DefaultCardFooter,
    Header: DefaultCardHeader,
    Content: DefaultCardContent,
    Logo: DefaultCardLogo,
    Divider: DefaultHorizontalDivider,
    AuthMethodListItem: DefaultAuthMethodListItem,

    SettingsSection: DefaultFormSection,
    SettingsSectionContent: DefaultFormSectionContent,
    SettingsSectionFooter: DefaultFormSectionFooter,
  },
  Node: {
    Button: DefaultButton,
    OidcButton: DefaultButtonSocial,
    CurrentIdentifierButton: DefaultCurrentIdentifierButton,
    Input: DefaultInput,
    CodeInput: DefaultPinCodeInput,
    Image: DefaultImage,
    Label: DefaultLabel,
    Checkbox: DefaultCheckbox,
    Text: DefaultText,
    Anchor: DefaultLinkButton,
  },
  Form: {
    Root: DefaultFormContainer,
    Group: DefaultGroupContainer,
    OidcRoot: DefaultSocialButtonContainer,
    RecoveryCodesSettings: DefaultSettingsRecoveryCodes,
    TotpSettings: DefaultSettingsTotp,
    OidcSettings: DefaultSettingsOidc,
    WebauthnSettings: DefaultSettingsWebauthn,
    PasskeySettings: DefaultSettingsPasskey,
  },
  Message: {
    Root: DefaultMessageContainer,
    Content: DefaultMessage,
  },
  Page: {
    Header: DefaultPageHeader,
  },
}
