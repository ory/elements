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

export const OryDefaultComponents: OryFlowComponents = {
  Card: {
    Root: DefaultCard,
    Footer: DefaultCardFooter,
    Header: DefaultCardHeader,
    Content: DefaultCardContent,
    Logo: DefaultCardLogo,
    Divider: DefaultHorizontalDivider,
    AuthMethodListItem: DefaultAuthMethodListItem,
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
  },
  Message: {
    Root: DefaultMessageContainer,
    Content: DefaultMessage,
  },
  Settings: {
    FormSection: DefaultFormSection,
    FormSectionContent: DefaultFormSectionContent,
    FormSectionFooter: DefaultFormSectionFooter,
    RecoveryCodes: DefaultSettingsRecoveryCodes,
    Totp: DefaultSettingsTotp,
    Oidc: DefaultSettingsOidc,
    Webauthn: DefaultSettingsWebauthn,
    Passkey: DefaultSettingsPasskey,
  },
}
