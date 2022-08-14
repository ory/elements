import { ComponentWrapper } from './component-wrapper';
import {
  ButtonLinkProps,
  ButtonProps,
  ButtonSocialProps,
  CardProps,
  CheckboxProps,
  DividerProps,
  TypographyProps,
  SelfServiceAuthCardProps,
  SelfServiceFlowFormProps,
  ThemeProviderProps,
  InputFieldProps,
  MessageProps,
  SelfServiceErrorCardProps
} from '../component-types';
import {
  Checkbox as checkbox,
  Card as card,
  Button as button,
  ButtonSocial as buttonSocial,
  ButtonLink as buttonLink,
  Divider as divider,
  SelfServiceAuthCard as selfServiceAuthCard,
  SelfServiceFlowForm as selfServiceFlowForm,
  Typography as typography,
  ThemeProvider as themeProvider,
  Message as message,
  InputField as inputField,
  SelfServiceErrorCard as selfServiceErrorCard
} from '../react-components';

export const ButtonLink = (props: ButtonLinkProps) => {
  return ComponentWrapper(buttonLink(props));
};

export const ButtonSocial = (props: ButtonSocialProps) => {
  return ComponentWrapper(buttonSocial(props));
};

export const Button = (props: ButtonProps) => {
  return ComponentWrapper(button(props));
};

export const Card = (props: CardProps) => {
  return ComponentWrapper(card(props));
};

export const Checkbox = (props: CheckboxProps) => {
  return ComponentWrapper(checkbox(props));
};

export const Divider = (props: DividerProps) => {
  return ComponentWrapper(divider(props));
};

export const Typography = (props: TypographyProps) => {
  return ComponentWrapper(typography(props));
};

export const ThemeProvider = (props: ThemeProviderProps) => {
  return ComponentWrapper(themeProvider(props));
};

export const InputField = (props: InputFieldProps) => {
  return ComponentWrapper(inputField(props));
};

export const Message = (props: MessageProps) => {
  return ComponentWrapper(message(props));
};

export const SelfServiceAuthCard = (props: SelfServiceAuthCardProps) => {
  return ComponentWrapper(selfServiceAuthCard(props));
};

export const SelfServiceFlowForm = (props: SelfServiceFlowFormProps) => {
  return ComponentWrapper(selfServiceFlowForm(props));
};

export const SelfServiceErrorCard = (props: SelfServiceErrorCardProps) => {
  return ComponentWrapper(selfServiceErrorCard(props));
};
