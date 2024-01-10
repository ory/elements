// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  Button as button,
  ButtonLink as buttonLink,
  ButtonLinkProps,
  ButtonProps,
  ButtonSocial as buttonSocial,
  ButtonSocialProps,
  Card as card,
  CardGradient as cardGradient,
  CardGradientProps,
  CardProps,
  Checkbox as checkbox,
  CheckboxProps,
  CodeBox as codeBox,
  CodeBoxProps,
  Divider as divider,
  DividerProps,
  InputField as inputField,
  InputFieldProps,
  LookupSecretSettingsProps,
  LookupSecretSettingsSection as lookupSecretSettingsSection,
  MenuLink as menuLink,
  MenuLinkProps,
  Message as message,
  MessageProps,
  Nav as nav,
  NavProps,
  NodeMessages as nodeMessages,
  NodeMessagesProps,
  OIDCSettingsProps,
  OIDCSettingsSection as oidcSettingsSection,
  PasswordSettingsProps,
  PasswordSettingsSection as passwordSettingsSection,
  ProfileSettingsProps,
  ProfileSettingsSection as profileSettingsSection,
  SettingScreenNavigationProps,
  ThemeProvider as themeProvider,
  ThemeProviderProps,
  TOTPSettingsProps,
  TOTPSettingsSection as totpSettingsSection,
  Typography as typography,
  TypographyProps,
  UserAuthCard as userAuthCard,
  UserAuthCardProps,
  UserAuthForm as userAuthForm,
  UserAuthFormProps,
  UserConsentCard as userConsentCard,
  UserConsentCardProps,
  UserErrorCard as userErrorCard,
  UserErrorCardProps,
  UserLogoutCard as userLogoutCard,
  UserLogoutCardProps,
  UserSettingsCard as userSettingsCard,
  UserSettingsCardProps,
  UserSettingsScreen as userSettingsScreen,
  UserSettingsScreenProps,
  WebAuthnSettingsProps,
  WebAuthnSettingsSection as webAuthnSettingsSection,
  PasskeySettingsSection as passkeySettingsSection,
  PasskeySettingsProps,
} from "../react-components"
import { ComponentWrapper, Context } from "./component-wrapper"

export const ButtonLink = (props: ButtonLinkProps, context: Context = {}) => {
  return ComponentWrapper(buttonLink, props, context)
}

export const ButtonSocial = (
  props: ButtonSocialProps,
  context: Context = {},
) => {
  return ComponentWrapper(buttonSocial, props, context)
}

export const Button = (props: ButtonProps, context: Context = {}) => {
  return ComponentWrapper(button, props, context)
}

export const Card = (props: CardProps, context: Context = {}) => {
  return ComponentWrapper(card, props, context)
}

export const CardGradient = (
  props: CardGradientProps,
  context: Context = {},
) => {
  return ComponentWrapper(cardGradient, props, context)
}
export const Checkbox = (props: CheckboxProps, context: Context = {}) => {
  return ComponentWrapper(checkbox, props, context)
}

export const Divider = (props: DividerProps, context: Context = {}) => {
  return ComponentWrapper(divider, props, context)
}

export const Typography = (props: TypographyProps, context: Context = {}) => {
  return ComponentWrapper(typography, props, context)
}

export const ThemeProvider = (
  props: ThemeProviderProps,
  context: Context = {},
) => {
  return ComponentWrapper(themeProvider, props, context)
}

export const InputField = (props: InputFieldProps, context: Context = {}) => {
  return ComponentWrapper(inputField, props, context)
}

export const Message = (props: MessageProps, context: Context = {}) => {
  return ComponentWrapper(message, props, context)
}

export const UserAuthCard = (
  props: UserAuthCardProps,
  context: Context = {},
) => {
  return ComponentWrapper(userAuthCard, props, context)
}

export const UserAuthForm = (
  props: UserAuthFormProps,
  context: Context = {},
) => {
  return ComponentWrapper(userAuthForm, props, context)
}

export const UserSettingsCard = (
  props: UserSettingsCardProps,
  context: Context = {},
) => {
  return ComponentWrapper(userSettingsCard, props, context)
}

export const UserSettingsScreen = (
  props: UserSettingsScreenProps,
  navProps: SettingScreenNavigationProps,
  context: Context = {},
) => {
  return {
    Nav: ComponentWrapper(
      userSettingsScreen.Nav,
      { ...props, ...navProps },
      context,
    ),
    Body: ComponentWrapper(userSettingsScreen.Body, props, context),
  }
}

export const UserErrorCard = (
  props: UserErrorCardProps,
  context: Context = {},
) => {
  return ComponentWrapper(userErrorCard, props, context)
}

export const NodeMessages = (
  props: NodeMessagesProps,
  context: Context = {},
) => {
  return ComponentWrapper(nodeMessages, props, context)
}

export const MenuLink = (props: MenuLinkProps, context: Context = {}) => {
  return ComponentWrapper(menuLink, props, context)
}

export const Nav = (props: NavProps, context: Context = {}) => {
  return ComponentWrapper(nav, props, context)
}

export const CodeBox = (props: CodeBoxProps, context: Context = {}) => {
  return ComponentWrapper(codeBox, props, context)
}

export const ProfileSettingsSection = (
  props: ProfileSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(profileSettingsSection, props, context)
}

export const PasswordSettingsSection = (
  props: PasswordSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(passwordSettingsSection, props, context)
}

export const WebAuthnSettingsSection = (
  props: WebAuthnSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(webAuthnSettingsSection, props, context)
}

export const PasskeySettingsSection = (
  props: PasskeySettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(passkeySettingsSection, props, context)
}

export const OIDCSettingsSection = (
  props: OIDCSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(oidcSettingsSection, props, context)
}

export const TOTPSettingsSection = (
  props: TOTPSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(totpSettingsSection, props, context)
}

export const LookupSecretSettingsSection = (
  props: LookupSecretSettingsProps,
  context: Context = {},
) => {
  return ComponentWrapper(lookupSecretSettingsSection, props, context)
}

export const UserConsentCard = (
  props: UserConsentCardProps,
  context: Context = {},
) => ComponentWrapper(userConsentCard, props, context)

export const UserLogoutCard = (
  props: UserLogoutCardProps,
  context: Context = {},
) => ComponentWrapper(userLogoutCard, props, context)

export type {
  ButtonLinkProps,
  ButtonProps,
  ButtonSocialProps,
  CardProps,
  CheckboxProps,
  CodeBoxProps,
  DividerProps,
  InputFieldProps,
  LookupSecretSettingsProps,
  MenuLinkProps,
  MessageProps,
  NavProps,
  NavSection,
  NavSectionLinks,
  NodeMessagesProps,
  OIDCSettingsProps,
  PasswordSettingsProps,
  ProfileSettingsProps,
  ThemeProviderProps,
  TOTPSettingsProps,
  TypographyProps,
  UserAuthCardProps,
  UserAuthFormProps,
  UserConsentCardProps,
  UserLogoutCardProps,
  UserErrorCardProps,
  UserSettingsCardProps,
  UserSettingsFlowType,
  WebAuthnSettingsProps,
} from "../react-components"
