import React from "react"
import { Card } from "../card"
import {
  UserAuthFormAdditionalProps,
  UserAuthForm,
} from "./helpers/user-auth-form"
import { Message } from "../message"
import { gridStyle } from "../../theme"
import { SelfServiceLoginFlow } from "@ory/client"
import { useScriptNodes } from "./helpers/node-script"
import { SelfServiceFlow } from "./helpers/types"
import { LoginSection } from "./sections/login-section"
import { LinkSection } from "./sections/link-section"
import { Divider } from "../divider"
import { MessageSection, MessageSectionProps } from "./helpers/common"
import { PasswordlessSection } from "./sections/passwordless-section"
import { OIDCSection } from "./sections/oidc-section"
import { RegistrationSection } from "./sections/registration-section"

export type LoginSectionAdditionalProps = {
  forgotPasswordURL?: string
  signupURL?: string
  logoutURL?: string
}

export type RegistrationSectionAdditionalProps = {
  loginURL?: string
}

export type VerificationSectionAdditionalProps = {
  signupURL?: string
}

export type RecoverySectionAdditionalProps = {
  loginURL?: string
}

export type UserAuthCardProps = {
  flow: SelfServiceFlow
  title: string
  flowType: "login" | "registration" | "recovery" | "verification"
  additionalProps:
    | LoginSectionAdditionalProps
    | RegistrationSectionAdditionalProps
    | RecoverySectionAdditionalProps
    | VerificationSectionAdditionalProps
  includeScripts?: boolean
  icon?: string
  className?: string
  children?: string
} & UserAuthFormAdditionalProps

export const UserAuthCard = ({
  flow,
  title,
  flowType,
  additionalProps,
  onSubmit,
  includeScripts,
}: UserAuthCardProps): JSX.Element => {
  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let $flow = null
  let $oidc = null
  let $passwordless = null
  let message: MessageSectionProps | null = null

  // the user might need to logout on the second factor page.
  const isLoggedIn = (flow: SelfServiceLoginFlow): boolean => {
    return flow.refresh || flow.requested_aal === "aal2"
  }

  switch (flowType) {
    case "login":
      $passwordless = PasswordlessSection(flow)
      $oidc = OIDCSection(flow)
      $flow = LoginSection({
        nodes: flow.ui.nodes,
        isLoggedIn: isLoggedIn(flow as SelfServiceLoginFlow),
        ...additionalProps,
      })
      message = isLoggedIn(flow as SelfServiceLoginFlow)
        ? {
            text: <>Something&#39;s not working?</>,
            buttonText: "Logout",
            url: (additionalProps as LoginSectionAdditionalProps).logoutURL,
          }
        : {
            buttonText: "Sign up",
            url: (additionalProps as LoginSectionAdditionalProps).signupURL,
            text: <>Don&#39;t have an account?</>,
            dataTestId: "signup-link",
          }
      break
    case "registration":
      $passwordless = PasswordlessSection(flow)
      $oidc = OIDCSection(flow)
      $flow = RegistrationSection({
        nodes: flow.ui.nodes,
      })
      message = {
        text: "Already have an account?",
        url: (additionalProps as RegistrationSectionAdditionalProps).loginURL,
        buttonText: "Sign in",
        dataTestId: "cta-link",
      }
      break
    // both verification and recovery use the same flow.
    case "recovery":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      })
      message = {
        text: "Already have an account?",
        url: (additionalProps as RecoverySectionAdditionalProps).loginURL,
        buttonText: "Sign in",
        dataTestId: "cta-link",
      }
      break
    case "verification":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      })
      message = {
        text: "Don't have an account?",
        url: (additionalProps as VerificationSectionAdditionalProps).signupURL,
        buttonText: "Sign up",
        dataTestId: "cta-link",
      }
      break
    default:
      $flow = null
  }

  return (
    <Card title={title}>
      <div className={gridStyle({ gap: 32 })}>
        {flow.ui.messages &&
          flow.ui.messages.length > 0 &&
          flow.ui.messages.map((m) => (
            <Message
              key={m.id}
              severity={"error"}
              data-testid={`ui/message/${m.id}`}
            >
              {m.text}
            </Message>
          ))}
        {$oidc && (
          <>
            <Divider />
            <UserAuthForm flow={flow}>{$oidc}</UserAuthForm>
          </>
        )}
        {$flow && (
          <>
            <Divider />
            <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
              {$flow}
            </UserAuthForm>
          </>
        )}
        {$flow && $passwordless && <Divider text="or" />}
        {$passwordless && (
          <UserAuthForm flow={flow} submitOnEnter={true} onSubmit={onSubmit}>
            {$passwordless}
          </UserAuthForm>
        )}
        {message && MessageSection(message)}
      </div>
    </Card>
  )
}
