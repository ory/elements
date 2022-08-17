import {
  ButtonSocialStyle,
  ButtonStyle,
  ColorSprinkle,
  MessageStyle,
  Theme,
  TypographyStyle
} from '../theme';

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string | undefined;
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

type buttonSocialStyle = ButtonSocialStyle & {};

export interface ButtonSocialProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonSocialStyle {
  title: string;
  brand: string;
  fullWidth?: boolean;
  className?: string;
}

type buttonStyle = ButtonStyle & {};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonStyle {
  title: string;
  fullWidth?: boolean;
  className?: string;
}

export type CardProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export interface DividerProps extends React.HTMLProps<HTMLHRElement> {
  fullWidth?: boolean;
  className?: string;
}

type typographyStyle = TypographyStyle & {};
type colorSprinkle = ColorSprinkle & {};
export interface TypographyProps
  extends Omit<React.BaseHTMLAttributes<HTMLBaseElement>, 'color'>,
    typographyStyle,
    colorSprinkle {
  children: React.ReactNode;
}

export type ThemeProviderProps = {
  theme?: 'light' | 'dark';
  themeOverrides?: Partial<Theme>;
  children?: React.ReactNode;
};

type messageProps = MessageStyle & {};

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    messageProps {
  className?: string;
  children?: React.ReactNode;
}

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  fullWidth?: boolean;
  className?: string;
}

// SelfServiceAuthCard props
import {
  SelfServiceError,
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow,
  UiNode,
  UiNodeScriptAttributes
} from '@ory/client';

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRecoveryFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow;

export type ErrorProps = {
  code: number;
  details: {
    docs: string;
    hint: string;
    rejectReason: string;
  };
  message: string;
  status: string;
  reason: string;
};

export type AdditionalProps = {
  forgotPasswordURL?: string;
  signupURL?: string;
  logoutURL?: string;
  loginURL?: string;
};

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  title: string;
  flowType: 'login' | 'registration' | 'recovery' | 'verification';
  additionalProps: AdditionalProps;
  injectScripts?: boolean;
  icon?: string;
  className?: string;
  children?: string;
};

// SelfServiceFlowForm props
export interface SelfServiceFlowFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  flow: SelfServiceFlow;
  children: React.ReactNode;
  submitOnEnter?: boolean;
  className?: string;
}

// SelfServiceErrorCard props
export type SelfServiceErrorCardProps = {
  title: string;
  error: SelfServiceError;
  backURL: string;
  contactSupportEmail?: string;
};
