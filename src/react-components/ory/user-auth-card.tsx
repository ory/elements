// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  VerificationFlow,
} from "@ory/client"
import { filterNodesByGroups } from "../../ui"
import { useIntl } from "react-intl"

import { gridStyle, typographyStyle } from "../../theme"
import type { CustomHref } from "../button-link"
import { Card } from "../card"
import { Divider } from "../divider"
import { Message } from "../message"
import { MessageSection, MessageSectionProps } from "./helpers/common"
import { NodeMessages } from "./helpers/error-messages"
import { FilterFlowNodes } from "./helpers/filter-flow-nodes"
import { useScriptNodes } from "./helpers/node-script"
import {
  UserAuthForm,
  UserAuthFormAdditionalProps,
} from "./helpers/user-auth-form"
import {
  hasHiddenIdentifier,
  hasLookupSecret,
  hasPasskey,
  hasPassword,
  hasProfile,
  hasTotp,
  hasWebauthn,
} from "./helpers/utils"
import { AuthCodeSection } from "./sections/auth-code-section"
import { LinkSection } from "./sections/link-section"
import { LoggedInInfo } from "./sections/logged-info"
import {
  LoginSection,
  IdentifierFirstLoginSection,
} from "./sections/login-section"
import { OIDCSection } from "./sections/oidc-section"
import {
  PasskeyLoginSection,
  PasskeySection,
  PasswordlessLoginSection,
  PasswordlessSection,
} from "./sections/passwordless-section"
import { RegistrationSection } from "./sections/registration-section"
import {
  ProfileLoginSection,
  ProfileRegistrationSection,
} from "./sections/profile-section"

export interface LoginSectionAdditionalProps {
  forgotPasswordURL?: CustomHref | string
  signupURL?: CustomHref | string
  logoutURL?: CustomHref | string
  loginURL?: CustomHref | string
}

export interface RegistrationSectionAdditionalProps {
  loginURL?: CustomHref | string
}

export interface VerificationSectionAdditionalProps {
  signupURL?: CustomHref | string
}

export interface RecoverySectionAdditionalProps {
  loginURL?: CustomHref | string
}

/**
 * UserAuthCardProps used by the UserAuthCard
 * @param title - title of the user auth card
 * @param subtitle - subtitle of the user auth card, usually used to display additional information
 * @param cardImage - an image to display on the card header (usually a logo)
 * @param includeScripts - include webauthn scripts in the card (optional)
 * @param className - className to pass to the card component
 * @param additionalProps - additional props to pass to the form (optional)
 */
export type UserAuthCardProps = {
  title?: string
  subtitle?: string
  cardImage?: string | React.ReactElement | React.FunctionComponent
  includeScripts?: boolean
  className?: string
} & UserAuthFormAdditionalProps &
  FlowProps

type FlowProps =
  | {
      flow: LoginFlow
      flowType: "login"
      additionalProps?: LoginSectionAdditionalProps
    }
  | {
      flow: RegistrationFlow
      flowType: "registration"
      additionalProps?: RegistrationSectionAdditionalProps
    }
  | {
      flow: RecoveryFlow
      flowType: "recovery"
      additionalProps?: RecoverySectionAdditionalProps
    }
  | {
      flow: VerificationFlow
      flowType: "verification"
      additionalProps?: VerificationSectionAdditionalProps
    }

/**
 * UserAuthCard renders a login, registration, verification or recovery flow
 * it can also handle multi factor authentication on login flows
 * @param UserAuthCardProps - a card that renders a login, registration, verification or recovery flow
 * @returns JSX.Element
 */
export const UserAuthCard = ({
  title,
  subtitle,
  additionalProps,
  cardImage,
  onSubmit,
  includeScripts,
  className,
  flow,
  flowType,
}: UserAuthCardProps): JSX.Element => {
  // Safe, because we know that the props are of the correct type
  const flowProps = { flow, flowType, additionalProps } as FlowProps
  const intl = useIntl()

  if (includeScripts) {
    useScriptNodes({ nodes: flowProps.flow.ui.nodes })
  }

  if (!title) {
    switch (flowProps.flowType) {
      case "login":
        if (flowProps.flow.refresh) {
          title = intl.formatMessage({
            id: "login.title-refresh",
            defaultMessage: "Confirm it's you",
          })
        } else if (flowProps.flow.requested_aal === "aal2") {
          title = intl.formatMessage({
            id: "login.title-aal2",
            defaultMessage: "Second factor authentication",
          })
        } else {
          title = intl.formatMessage({
            id: "login.title",
            defaultMessage: "Sign in",
          })
        }
        break
      case "registration":
        title = intl.formatMessage({
          id: "registration.title",
          defaultMessage: "Register an account",
        })
        break
      case "recovery":
        title = intl.formatMessage({
          id: "recovery.title",
          defaultMessage: "Recover your account",
        })
        break
      case "verification":
        title = intl.formatMessage({
          id: "verification.title",
          defaultMessage: "Verify your account",
        })
        break
    }
  }
  if (!subtitle) {
    switch (flowProps.flowType) {
      case "login":
        if (flowProps.flow.oauth2_login_request) {
          subtitle = intl.formatMessage(
            {
              id: "login.subtitle-oauth2",
              defaultMessage: "To authenticate {clientName}",
            },
            {
              clientName:
                flowProps.flow.oauth2_login_request.client?.client_name ??
                flowProps.flow.oauth2_login_request.client?.client_uri,
            },
          )
        }
        break
      case "registration":
        if (flowProps.flow.oauth2_login_request) {
          subtitle = intl.formatMessage(
            {
              id: "registration.subtitle-oauth2",
              defaultMessage: "To authenticate {clientName}",
            },
            {
              clientName:
                flowProps.flow.oauth2_login_request.client?.client_name ??
                flowProps.flow.oauth2_login_request.client?.client_uri,
            },
          )
        }
        break
    }
  }

  let $flow: JSX.Element | null = null
  let $oidc: JSX.Element | null = null
  let $code: JSX.Element | null = null
  let $passwordlessWebauthn: JSX.Element | null = null
  let $passkey: JSX.Element | null = null
  let $twoStep: JSX.Element | null = null
  let $profile: JSX.Element | null = null
  let message: MessageSectionProps | null = null

  // the user might need to logout on the second factor page.
  const isLoggedIn = (flow: LoginFlow): boolean => {
    if (flow.requested_aal === "aal2") {
      return true
    } else if (flow.refresh) {
      return true
    }
    return false
  }

  // passwordless can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
  // we want the login section to handle passwordless as well when we have a 2FA screen.
  const canShowPasswordless = () =>
    !!$passwordlessWebauthn &&
    (!isLoggedIn(flow as LoginFlow) || flowProps.flowType === "registration")

  // passkey can be shown if the user is not logged in (e.g. exclude 2FA screen) or if the flow is a registration flow.
  // we want the login section to handle passwordless as well when we have a 2FA screen.
  const canShowPasskey = () =>
    !!$passkey &&
    (!isLoggedIn(flow as LoginFlow) || flowProps.flowType === "registration")

  const canShowProfile = () => !!$profile && hasProfile(flow.ui.nodes)

  // the current flow is a two factor flow if the user is logged in and has any of the second factor methods enabled.
  const isTwoFactor = () =>
    flowProps.flowType === "login" &&
    isLoggedIn(flowProps.flow) &&
    (hasTotp(flow.ui.nodes) ||
      hasWebauthn(flow.ui.nodes) ||
      hasPasskey(flow.ui.nodes) ||
      hasLookupSecret(flow.ui.nodes))

  // we check if nodes have hidden identifier, so we can display "you're looged in as" information
  const showLoggedAccount = hasHiddenIdentifier(flow.ui.nodes)

  // This function will map all the 2fa flows with their own respective forms.
  // It also helps with spacing them and adding visual dividers between each flow *if* there are more than one flow.
  //
  // Code smell: This is not really only two factor flows, but more generic refresh / forced / re-authentication flows.
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
      hasPasskey(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="passkey-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ["passkey"],
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
      hasProfile(flow.ui.nodes) && (
        <UserAuthForm flow={flow} data-testid="profile-flow">
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: "profile",
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
                excludeAttributeTypes: "submit",
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

  switch (flowProps.flowType) {
    case "login":
      $passwordlessWebauthn = PasswordlessLoginSection(flow)
      $passkey = PasskeyLoginSection(flow)
      $twoStep = IdentifierFirstLoginSection(flow)
      $oidc = OIDCSection(flow)
      $profile = ProfileLoginSection(flow)
      $code = AuthCodeSection({ nodes: flow.ui.nodes })

      $flow = LoginSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      })

      if (flowProps.flow.ui.messages?.some((m) => m.id === 1010016)) {
        // This is a special case for the account linking UI, to show a cancel button.
        message = {
          text: intl.formatMessage({
            id: "login.cancel-label",
            defaultMessage: "Not the right account?",
          }),
          buttonText: intl.formatMessage({
            id: "login.cancel-button",
            defaultMessage: "Cancel",
          }),
          url: flowProps.additionalProps?.loginURL,
          dataTestId: "cancel-link",
        }
      } else if (
        isLoggedIn(flowProps.flow) &&
        flowProps.additionalProps?.logoutURL
      ) {
        message = {
          text: intl.formatMessage({
            id: "login.logout-label",
            defaultMessage: "Something's not working?",
          }),
          buttonText: intl.formatMessage({
            id: "login.logout-button",
            defaultMessage: "Logout",
          }),
          dataTestId: "logout-link",
          url: flowProps.additionalProps.logoutURL,
        }
      } else if (flowProps.additionalProps?.signupURL) {
        message = {
          text: intl.formatMessage({
            id: "login.registration-label",
            defaultMessage: "Don't have an account?",
          }),
          buttonText: intl.formatMessage({
            id: "login.registration-button",
            defaultMessage: "Sign up",
          }),
          url: flowProps.additionalProps.signupURL,
          dataTestId: "signup-link",
        }
      }
      break
    case "registration":
      $passwordlessWebauthn = PasswordlessSection(flow)
      $passkey = PasskeySection(flow)
      $profile = ProfileRegistrationSection(flow)
      $oidc = OIDCSection(flow)
      $code = AuthCodeSection({ nodes: flow.ui.nodes })
      $flow = RegistrationSection({
        nodes: flow.ui.nodes,
      })
      if (flowProps.additionalProps?.loginURL) {
        message = {
          text: intl.formatMessage({
            id: "registration.login-label",
            defaultMessage: "Already have an account?",
          }),
          url: flowProps.additionalProps.loginURL,
          buttonText: intl.formatMessage({
            id: "registration.login-button",
            defaultMessage: "Sign in",
          }),
          dataTestId: "cta-link",
        }
      }
      break
    // both verification and recovery use the same flow.
    case "recovery":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      })
      if (flowProps.additionalProps?.loginURL) {
        message = {
          text: intl.formatMessage({
            id: "recovery.login-label",
            defaultMessage: "Remember your credentials?",
          }),
          buttonText: intl.formatMessage({
            id: "recovery.login-button",
            defaultMessage: "Sign in",
          }),
          url: flowProps.additionalProps.loginURL,
          dataTestId: "cta-link",
        }
      }
      break
    case "verification":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
      })
      if (flowProps.additionalProps?.signupURL) {
        message = {
          text: intl.formatMessage({
            id: "verification.registration-label",
            defaultMessage: "Don't have an account?",
          }),
          buttonText: intl.formatMessage({
            id: "verification.registration-button",
            defaultMessage: "Sign up",
          }),
          url: flowProps.additionalProps.signupURL,
          dataTestId: "cta-link",
        }
      }
      break
    default:
      $flow = null
  }

  return (
    <Card
      className={className}
      heading={
        <h2 className={typographyStyle({ type: "regular", size: "small" })}>
          {title}
        </h2>
      }
      image={cardImage}
      data-testid={`${flowProps.flowType}-auth-card`}
    >
      <div className={gridStyle({ gap: 32 })}>
        {subtitle && <Message severity="default">{subtitle}</Message>}
        <NodeMessages uiMessages={flow.ui.messages} />
        <Divider />

        {$oidc && (
          <>
            <UserAuthForm
              flow={flow}
              data-testid={`${flowProps.flowType}-flow-oidc`}
            >
              {$oidc}
            </UserAuthForm>
            <Divider />
          </>
        )}

        {$twoStep && (
          <>
            <UserAuthForm
              flow={flow}
              data-testid={`${flowProps.flowType}-two-step`}
            >
              {$twoStep}
            </UserAuthForm>
          </>
        )}

        {canShowPasskey() && (
          <>
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={"passkey-flow"}
            >
              {$passkey}
            </UserAuthForm>
          </>
        )}

        {$code && (
          <>
            <UserAuthForm
              flow={flow}
              data-testid={`${flowProps.flowType}-flow-code`}
            >
              {$code}
            </UserAuthForm>
          </>
        )}

        {$flow && !isTwoFactor() && (
          <>
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={`${flowProps.flowType}-flow`}
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
                groups: [
                  "password",
                  "webauthn",
                  "passkey",
                  "totp",
                  "lookup_secret",
                ],
              })}
            />
            {twoFactorFlows()}
          </>
        )}

        {canShowPasswordless() && (
          <>
            <UserAuthForm
              flow={flow}
              submitOnEnter={true}
              onSubmit={onSubmit}
              data-testid={"passwordless-flow"}
              formFilterOverride={{
                nodes: flow.ui.nodes,
                groups: ["default", "webauthn"],
                attributes: "hidden",
              }}
            >
              {$passwordlessWebauthn}
            </UserAuthForm>
          </>
        )}

        {canShowProfile() && (
          <>
            <UserAuthForm
              flow={flow}
              data-testid={`${flowProps.flowType}-flow-profile`}
            >
              {$profile}
            </UserAuthForm>
          </>
        )}

        {showLoggedAccount && <LoggedInInfo flow={flow} />}

        {message && MessageSection(message)}
      </div>
    </Card>
  )
}
