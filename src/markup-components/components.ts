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
  UserErrorCard as userErrorCard,
  UserErrorCardProps,
  UserSettingsCard as userSettingsCard,
  UserSettingsCardProps,
  WebAuthnSettingsProps,
  WebAuthnSettingsSection as webAuthnSettingsSection,
} from "../react-components"
import { CodeBoxProps } from "../react-components/codebox"
import { ComponentWrapper } from "./component-wrapper"

export const ButtonLink = (props: ButtonLinkProps) => {
  return ComponentWrapper(buttonLink(props))
}

export const ButtonSocial = (props: ButtonSocialProps) => {
  return ComponentWrapper(buttonSocial(props))
}

export const Button = (props: ButtonProps) => {
  return ComponentWrapper(button(props))
}

export const Card = (props: CardProps) => {
  return ComponentWrapper(card(props))
}

export const CardGradient = (props: CardGradientProps) => {
  return ComponentWrapper(cardGradient(props))
}
export const Checkbox = (props: CheckboxProps) => {
  return ComponentWrapper(checkbox(props))
}

export const Divider = (props: DividerProps) => {
  return ComponentWrapper(divider(props))
}

export const Typography = (props: TypographyProps) => {
  return ComponentWrapper(typography(props))
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  return ComponentWrapper(themeProvider(props))
}

export const InputField = (props: InputFieldProps) => {
  return ComponentWrapper(inputField(props))
}

export const Message = (props: MessageProps) => {
  return ComponentWrapper(message(props))
}

export const UserAuthCard = (props: UserAuthCardProps) => {
  return ComponentWrapper(userAuthCard(props))
}

export const UserAuthForm = (props: UserAuthFormProps) => {
  return ComponentWrapper(userAuthForm(props))
}

export const UserSettingsCard = (props: UserSettingsCardProps) => {
  const component = userSettingsCard(props)
  return component ? ComponentWrapper(component) : ""
}

export const UserErrorCard = (props: UserErrorCardProps) => {
  return ComponentWrapper(userErrorCard(props))
}

export const NodeMessages = (props: NodeMessagesProps) => {
  return ComponentWrapper(nodeMessages(props))
}

export const MenuLink = (props: MenuLinkProps) => {
  return ComponentWrapper(menuLink(props))
}

export const Nav = (props: NavProps) => {
  return ComponentWrapper(nav(props))
}

export const CodeBox = (props: CodeBoxProps) => {
  return ComponentWrapper(codeBox(props))
}

export const ProfileSettingsSection = (props: ProfileSettingsProps) => {
  return ComponentWrapper(profileSettingsSection(props))
}

export const PasswordSettingsSection = (props: PasswordSettingsProps) => {
  return ComponentWrapper(passwordSettingsSection(props))
}

export const WebAuthnSettingsSection = (props: WebAuthnSettingsProps) => {
  return ComponentWrapper(webAuthnSettingsSection(props))
}

export const OIDCSettingsSection = (props: OIDCSettingsProps) => {
  return ComponentWrapper(oidcSettingsSection(props))
}

export const TOTPSettingsSection = (props: TOTPSettingsProps) => {
  return ComponentWrapper(totpSettingsSection(props))
}

export const LookupSecretSettingsSection = (
  props: LookupSecretSettingsProps,
) => {
  return ComponentWrapper(lookupSecretSettingsSection(props))
}

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
  UserErrorCardProps,
  UserSettingsCardProps,
  UserSettingsFlowType,
  WebAuthnSettingsProps,
} from "../react-components"
