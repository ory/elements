import { SelfServiceLoginFlow } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import React from "react"
import { gridStyle, typographyStyle } from "../../theme"
import { Card } from "../card"
import { Divider } from "../divider"
import { Message } from "../message"
import { MessageSection, MessageSectionProps } from "./helpers/common"
import { NodeMessages } from "./helpers/error-messages"
import { FilterFlowNodes } from "./helpers/filter-flow-nodes"
import { useScriptNodes } from "./helpers/node-script"
import { SelfServiceFlow } from "./helpers/types"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form"
import {
  hasLookupSecret,
  hasPassword,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"
import { LinkSection } from "./sections/link-section"
import { LoginSection } from "./sections/login-section"
import { OIDCSection } from "./sections/oidc-section"
import { PasswordlessSection } from "./sections/passwordless-section"
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
  subtitle?: string
  cardImage?: string | React.ReactElement
  includeScripts?: boolean
  className?: string
  children?: string
} & UserAuthFormAdditionalProps

export const UserAuthCard = ({
  flow,
  title,
  subtitle,
  flowType,
  additionalProps,
  cardImage,
  onSubmit,
  includeScripts,
}: UserAuthCardProps): JSX.Element => {
  if (includeScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let $flow = null
  let $oidc = null
  let $passwordless: JSX.Element | null = null
  let message: MessageSectionProps | null = null

  // the user might need to logout on the second factor page.
  const isLoggedIn = (flow: SelfServiceLoginFlow): boolean => {
    return flow.refresh || flow.requested_aal === "aal2"
  }

  // passwordless can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
  // we want the login section to handle passwordless as well when we have a 2FA screen.
  const canShowPasswordless = () =>
    !!$passwordless &&
    (!isLoggedIn(flow as SelfServiceLoginFlow) || flowType === "registration")

  // the current flow is a two factor flow if the user is logged in and has any of the second factor methods enabled.
  const isTwoFactor = () =>
    isLoggedIn(flow as SelfServiceLoginFlow) &&
    flowType === "login" &&
    (hasTotp(flow.ui.nodes) ||
      hasWebauthn(flow.ui.nodes) ||
      hasLookupSecret(flow.ui.nodes))

  // this function will map all of the 2fa flows with their own respective forms.
  // it also helps with spacing them and adding visual dividers between each flow *if* there are more than 1 flows.
  const twoFactorFlows = () =>
    isTwoFactor() &&
    [
      hasWebauthn(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="webauthn-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "webauthn",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasPassword(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="password-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "password",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
      hasTotp(flow.ui.nodes) && (
        <UserAuthForm
          flow={flow}
          data-testid="totp-flow"
          onSubmit={onSubmit}
          submitOnEnter={true}
        >
          <div className={gridStyle({ gap: 32 })}>
            <FilterFlowNodes
              filter={{
                nodes: flow.ui.nodes,
                groups: "totp",
                withoutDefaultGroup: true,
                excludeAttributes: "submit",
              }}
            />
            <FilterFlowNodes
              filter={{
                nodes: flow.ui.nodes,
                groups: "totp",
                withoutDefaultGroup: true,
                attributes: "submit",
              }}
            />
          </div>
        </UserAuthForm>
      ),
      hasLookupSecret(flow.ui.nodes) && (
        <UserAuthForm
          flow={flow}
          data-testid="lookup-secret-flow"
          onSubmit={onSubmit}
          submitOnEnter={true}
        >
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "lookup_secret",
              withoutDefaultGroup: true,
            }}
          />
        </UserAuthForm>
      ),
    ]
      .filter(Boolean) // remove nulls
      .map((flow, index) => (
        <div key={index}>
          {index > 0 ? (
            <>
              <Divider /> {flow}
            </>
          ) : (
            flow
          )}
        </div>
      )) // only map the divider if the index is greater than 0 - more than one flow

  switch (flowType) {
    case "login":
      $passwordless = PasswordlessSection(flow)
      $oidc = OIDCSection(flow)

      $flow = LoginSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      })

      message = isLoggedIn(flow as SelfServiceLoginFlow)
        ? {
            text: <>Something&#39;s not working?</>,
            buttonText: "Logout",
            url: (additionalProps as LoginSectionAdditionalProps).logoutURL,
            dataTestId: "logout-link",
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
        text: "Remember your credentials?",
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
    <Card
      heading={
        <h2 className={typographyStyle({ type: "regular", size: "small" })}>
          {title}
        </h2>
      }
      image={cardImage}
    >
      <div className={gridStyle({ gap: 32 })}>
        {subtitle && <Message severity="default">{subtitle}</Message>}
        <NodeMessages uiMessages={flow.ui.messages} />
        {$oidc && (
          <>
            <Divider />
            <UserAuthForm flow={flow}>{$oidc}</UserAuthForm>
          </>
        )}
        {$flow && !isTwoFactor() && (
          <>
            <Divider />
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={`${flowType}-flow`}
            >
              {$flow}
            </UserAuthForm>
          </>
        )}
        {isTwoFactor() && (
          <>
            <NodeMessages
              nodes={filterNodesByGroups({
                nodes: flow.ui.nodes,
                groups: ["password", "webauthn", "totp", "lookup_secret"],
              })}
            />
            {twoFactorFlows()}
          </>
        )}

        {canShowPasswordless() && (
          <>
            <Divider />
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={"passwordless-flow"}
              formFilterOverride={{
                nodes: flow.ui.nodes,
                attributes: "hidden",
              }}
            >
              {$passwordless}
            </UserAuthForm>
          </>
        )}
        {message && MessageSection(message)}
      </div>
    </Card>
  )
}
