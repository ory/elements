import { ComponentWrapper } from "./component-wrapper"
import {
  Checkbox as checkbox,
  Card as card,
  Button as button,
  ButtonSocial as buttonSocial,
  ButtonLink as buttonLink,
  Divider as divider,
  UserAuthCard as userAuthCard,
  UserAuthForm as userAuthForm,
  UserSettingsCard as userSettingsCard,
  Typography as typography,
  ThemeProvider as themeProvider,
  Message as message,
  InputField as inputField,
  UserErrorCard as userErrorCard,
  MenuLinkProps,
  MenuLink as menuLink,
  NavProps,
  Nav as nav,
  ButtonLinkProps,
  ButtonSocialProps,
  ButtonProps,
  CardProps,
  CheckboxProps,
  DividerProps,
  TypographyProps,
  ThemeProviderProps,
  InputFieldProps,
  MessageProps,
  UserAuthCardProps,
  UserAuthFormProps,
  UserErrorCardProps,
  UserSettingsCardProps,
} from "../react-components"

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
  return ComponentWrapper(userSettingsCard(props))
}

export const UserErrorCard = (props: UserErrorCardProps) => {
  return ComponentWrapper(userErrorCard(props))
}

export const MenuLink = (props: MenuLinkProps) => {
  return ComponentWrapper(menuLink(props))
}

export const Nav = (props: NavProps) => {
  return ComponentWrapper(nav(props))
}
