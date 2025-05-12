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

export function DefaultCardFooter() {
  const oryFlow = useOryFlow()
  switch (oryFlow.flowType) {
    case FlowType.Login:
      return <LoginCardFooter />
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
  if (flow.refresh) {
    return true
  }
  if (formState.current === "select_method") {
    return flow.requested_aal === "aal2"
  }
  if (formState.current === "method_active" && flow.active === "code") {
    return true
  }
  if (formState.current === "method_active" && authMethods.length === 1) {
    return true
  }
  return false
}

function LoginCardFooter() {
  const { formState, flow, flowType, dispatchFormState } = useOryFlow()
  const config = useOryConfiguration()
  const intl = useIntl()

  if (flowType !== FlowType.Login) {
    return null
  }

  const authMethods = nodesToAuthMethodGroups(flow.ui.nodes)

  let returnTo = config.project.default_redirect_url
  if (flow.return_to) {
    returnTo = flow.return_to
  }
  if (!returnTo) {
    returnTo = restartFlowUrl(
      flow,
      `${config.sdk.url}/self-service/${flowType}/browser`,
    )
  }

  if (shouldShowLogoutButton(flow, formState, authMethods)) {
    return <LogoutButton returnTo={returnTo} />
  }

  return (
    <>
      {formState.current === "provide_identifier" &&
        config.project.registration_enabled && (
          <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
            {intl.formatMessage({
              id: "login.registration-label",
              defaultMessage: "No account?",
            })}{" "}
            <a
              className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
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
        <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
          <button
            className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
            onClick={() => {
              dispatchFormState({
                type: "action_method_selector",
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
    <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
      {intl.formatMessage({
        id: "login.2fa.go-back",
      })}{" "}
      <a
        className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
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
  const { flow, formState } = useOryFlow()
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
        <span className="font-normal leading-normal antialiased">
          <a
            className="font-medium text-button-link-brand-brand hover:text-button-link-brand-brand-hover"
            // This works, because it essentially reloads the page.
            // TODO: this should not do a full reload, but rather just update the state.....
            href=""
            data-testid={"ory/screen/registration/action/selectMethod"}
          >
            {intl.formatMessage({
              id: "card.footer.select-another-method",
              defaultMessage: "Select another method",
            })}
          </a>
        </span>
      )
    case "select_method":
    default:
      return (
        <span className="font-normal leading-normal antialiased text-interface-foreground-default-primary">
          {intl.formatMessage({
            id: "registration.login-label",
            defaultMessage: "Already have an account?",
          })}{" "}
          <a
            className="text-button-link-brand-brand transition-colors hover:text-button-link-brand-brand-hover underline"
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

type ConsentFlowProps = {
  flow: ConsentFlow
}

function ConsentCardFooter({ flow }: ConsentFlowProps) {
  const { Node } = useComponents()

  const rememberNode = findNode(flow.ui.nodes, {
    group: "oauth2_consent",
    node_type: "input",
    name: "remember",
  })

  return (
    <div className="flex gap-8 flex-col">
      <div>
        <p className="text-interface-foreground-default-secondary leading-normal font-medium">
          Make sure you trust {flow.consent_request.client?.client_name}
        </p>
        <p className="text-interface-foreground-default-secondary leading-normal">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        </span>
        {flow.consent_request.client?.client_name}
      </p>
    </div>
  )
}
