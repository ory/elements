// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow, UiNodeInputAttributes } from "@ory/client-fetch"
import {
  ConsentFlow,
  FormState,
  useComponents,
  useOryConfiguration,
  useOryFlow,
} from "@ory/elements-react"
import { useIntl } from "react-intl"
import { toAuthMethodPickerOptions } from "../../../../components/card/two-step/state-select-method"
import { findScreenSelectionButton } from "../../../../util/nodes"
import {
  findNode,
  nodesToAuthMethodGroups,
  useNodeGroupsWithVisibleNodes,
} from "../../../../util/ui"
import { useClientLogout } from "../../utils/logout"
import { initFlowUrl, restartFlowUrl } from "../../utils/url"

/**
 * DefaultCardFooter renders the default footer for the card component based on the current flow type.
 *
 * @returns The default card footer component that renders the appropriate footer based on the current flow type.
 * @group Components
 * @category Default Components
 */
export function DefaultCardFooter() {
  const oryFlow = useOryFlow()
  switch (oryFlow.flowType) {
    case FlowType.Login:
      return <LoginCardFooter flow={oryFlow.flow} />
    case FlowType.Registration:
      return <RegistrationCardFooter />
    case FlowType.Recovery:
      return <RecoveryCardFooter />
    case FlowType.Verification:
      return <VerificationCardFooter />
    case FlowType.OAuth2Consent:
      return <ConsentCardFooter flow={oryFlow.flow} />
    default:
      return null
  }
}

function shouldShowLogoutButton(
  flow: LoginFlow,
  formState: FormState,
  authMethods: string[],
) {
  // Always for refresh flows, as we know there is a session
  if (flow.refresh) {
    return true
  }

  // In aal2 flows we sometimes show the logout button
  if (flow.requested_aal === "aal2") {
    // Always on the "method selector" screen
    if (formState.current === "select_method") {
      return true
    }
    // On the "method active" screen, if it's a code method
    // If the method is any other than code, we want to show a "Choose another method" button
    // This is handled below.
    // TODO: refactor this, to not have this logic in two places
    if (formState.current === "method_active" && flow.active === "code") {
      return true
    }
    // If there are no other methods, we want to show the logout button
    // This is the case when the user only has one method (e.g. code or totp), set up
    // and the user is on the "method active" screen
    // In that case there is no "select_method" state, so going back to that screen wouldn't work
    if (formState.current === "method_active" && authMethods.length === 1) {
      return true
    }
  }
  return false
}

type LoginCardFooterProps = {
  flow: LoginFlow
}

function LoginCardFooter({ flow }: LoginCardFooterProps) {
  const { dispatchFormState, formState } = useOryFlow()
  const config = useOryConfiguration()
  const intl = useIntl()

  const authMethods = nodesToAuthMethodGroups(flow.ui.nodes)

  let returnTo = config.project.default_redirect_url
  if (flow.return_to) {
    returnTo = flow.return_to
  }
  if (!returnTo) {
    returnTo = restartFlowUrl(
      flow,
      `${config.sdk.url}/self-service/${FlowType.Login}/browser`,
    )
  }

  if (shouldShowLogoutButton(flow, formState, authMethods)) {
    return <LogoutButton returnTo={returnTo} />
  }

  return (
    <>
      {formState.current === "provide_identifier" &&
        config.project.registration_enabled && (
          <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
            {intl.formatMessage({
              id: "login.registration-label",
              defaultMessage: "No account?",
            })}{" "}
            <a
              className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
              href={initFlowUrl(config.sdk.url, "registration", flow)}
              data-testid={"ory/screen/login/action/register"}
            >
              {intl.formatMessage({
                id: "login.registration-button",
                defaultMessage: "Sign up",
              })}
            </a>
          </span>
        )}
      {authMethods.length > 1 && formState.current === "method_active" && (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          <button
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            onClick={() => {
              dispatchFormState({
                type: "action_clear_active_method",
              })
            }}
            data-testid={"ory/screen/login/mfa/action/selectMethod"}
          >
            {intl.formatMessage({
              id: "login.2fa.method.go-back",
            })}
          </button>
        </span>
      )}
      {authMethods.length === 1 &&
        authMethods[0] === "code" &&
        formState.current === "method_active" && (
          <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
            <a
              className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
              href={returnTo}
              data-testid={"ory/screen/login/action/cancel"}
            >
              {intl.formatMessage({
                id: "login.2fa.go-back.link",
              })}
            </a>
          </span>
        )}
    </>
  )
}

type LogoutButtonProps = {
  returnTo?: string
}

function LogoutButton({ returnTo }: LogoutButtonProps) {
  const config = useOryConfiguration()
  const intl = useIntl()
  const { logoutFlow: logout, didLoad: didLoadLogout } = useClientLogout(config)

  return (
    <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
      {intl.formatMessage({
        id: "login.2fa.go-back",
      })}{" "}
      <a
        className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        href={logout ? logout?.logout_url : returnTo}
        data-testid={
          // Only add the test-id when the logout link has loaded.
          didLoadLogout ? "ory/screen/login/action/logout" : undefined
        }
      >
        {intl.formatMessage({
          id:
            !didLoadLogout || logout
              ? "login.logout-button"
              : "login.2fa.go-back.link",
        })}
      </a>
    </span>
  )
}

function RegistrationCardFooter() {
  const intl = useIntl()
  const { flow, formState, dispatchFormState } = useOryFlow()
  const config = useOryConfiguration()
  const visibleGroups = useNodeGroupsWithVisibleNodes(flow.ui.nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  switch (formState.current) {
    case "method_active":
      if (!screenSelectionNode || Object.entries(authMethodBlocks).length < 2) {
        return null
      }

      return (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          <button
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            onClick={() => {
              dispatchFormState({
                type: "action_clear_active_method",
              })
            }}
            data-testid={"ory/screen/registration/action/selectMethod"}
            type="button"
          >
            {intl.formatMessage({
              id: "card.footer.select-another-method",
              defaultMessage: "Select another method",
            })}
          </button>
        </span>
      )
    case "select_method":
    default:
      return (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          {intl.formatMessage({
            id: "registration.login-label",
            defaultMessage: "Already have an account?",
          })}{" "}
          <a
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            href={initFlowUrl(config.sdk.url, "login", flow)}
            data-testid={"ory/screen/registration/action/login"}
          >
            {intl.formatMessage({
              id: "registration.login-button",
              defaultMessage: "Sign in",
            })}
          </a>
        </span>
      )
  }
}

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}

/**
 * Props for the ConsentCardFooter component.
 *
 * @hidden
 * @inline
 */
type ConsentCardFooterProps = {
  /** The consent flow to render the footer for. */
  flow: ConsentFlow
}

function ConsentCardFooter({ flow }: ConsentCardFooterProps) {
  const { Node } = useComponents()

  const rememberNode = findNode(flow.ui.nodes, {
    group: "oauth2_consent",
    node_type: "input",
    name: "remember",
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="leading-normal font-medium text-interface-foreground-default-secondary">
          Make sure you trust {flow.consent_request.client?.client_name}
        </p>
        <p className="leading-normal text-interface-foreground-default-secondary">
          You may be sharing sensitive information with this site or
          application.
        </p>
      </div>
      {rememberNode && (
        <Node.Checkbox
          attributes={rememberNode.attributes}
          node={rememberNode}
        />
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {flow.ui.nodes
          .filter(
            (n) =>
              n.attributes.node_type === "input" &&
              n.attributes.type === "submit",
          )
          .map((n) => {
            const attributes = n.attributes as UiNodeInputAttributes
            return (
              <Node.Button
                key={attributes.value}
                node={n}
                attributes={attributes}
              />
            )
          })}
      </div>
      <p className="text-sm">
        <span className="text-interface-foreground-default-tertiary">
          Authorizing will redirect to{" "}
          {flow.consent_request.client?.client_name}
        </span>
      </p>
    </div>
  )
}
