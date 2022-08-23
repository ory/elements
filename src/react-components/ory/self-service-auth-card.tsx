import React from "react"
import { Card } from "../card"
import { Divider } from "../divider"
import { FilterFlowNodes } from "./filter-flow-nodes"
import { SelfServiceFlowForm } from "./selfservice-flow-form"
import { ButtonLink } from "../button-link"
import { Message } from "../message"
import { colorSprinkle } from "../../theme/colors.css"
import { gridStyle } from "../../theme"
import { SelfServiceLoginFlow, UiNode } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { useScriptNodes } from "./node-script"
import { SelfServiceFlow } from "../../types"

export type ErrorProps = {
  code: number
  details: {
    docs: string
    hint: string
    rejectReason: string
  }
  message: string
  status: string
  reason: string
}

export type AdditionalProps = {
  forgotPasswordURL?: string
  signupURL?: string
  logoutURL?: string
  loginURL?: string
}

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow
  title: string
  flowType: "login" | "registration" | "recovery" | "verification"
  additionalProps: AdditionalProps
  activeFlow?: "password" | "passwordless"
  selectActiveFlowAction?: ((e: React.MouseEvent) => void) | string
  onFormSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  injectScripts?: boolean
  icon?: string
  className?: string
  children?: string
}

type loginCardProps = {
  nodes: UiNode[]
  isLoggedIn: boolean
  activeFlow?: "password" | "passwordless"
  selectActiveFlowAction?: ((e: React.MouseEvent) => void) | string
} & AdditionalProps

const $passwordlessSection = (nodes: UiNode[]): JSX.Element => {
  return <FilterFlowNodes filter={{ nodes, groups: "webauthn" }} />
}

const $loginSection = ({
  nodes,
  forgotPasswordURL: forgotPasswordUrl,
  signupURL: signupUrl,
  logoutURL: logoutUrl,
  isLoggedIn,
  activeFlow,
  selectActiveFlowAction,
}: loginCardProps): JSX.Element => {
  const message: messageSectionProps = isLoggedIn
    ? {
        text: <>Something&#39;s not working?</>,
        buttonText: "Logout",
        url: logoutUrl,
      }
    : {
        buttonText: "Sign up",
        url: signupUrl,
        text: <>Don&#39;t have an account?</>,
        dataTestId: "signup-link",
      }

  return isLoggedIn ? (
    <div className={gridStyle({ gap: 32 })}>
      <Divider />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          excludeAttributes: "hidden",
        }}
      />
      {$messageSection(message)}
    </div>
  ) : (
    <div className={gridStyle({ gap: 32 })}>
      <Divider />
      {activeFlow && activeFlow === "password" ? (
        <>
          <div className={gridStyle({ gap: 16 })}>
            <FilterFlowNodes
              filter={{
                nodes: nodes,
                groups: ["default", "password"],
                excludeAttributes: ["submit", "hidden"],
              }}
            />
            <ButtonLink
              data-testid="forgot-password-link"
              href={forgotPasswordUrl}
            >
              Forgot Password?
            </ButtonLink>
          </div>
          <FilterFlowNodes
            filter={{
              nodes: nodes,
              groups: ["password"],
              attributes: "submit",
            }}
          />
        </>
      ) : (
        $passwordlessSection(nodes)
      )}

      {selectActiveFlowAction && (
        <ButtonLink
          {...(typeof selectActiveFlowAction === "string"
            ? { href: selectActiveFlowAction }
            : {
                onClick: selectActiveFlowAction,
              })}
        >
          Alternative Login
        </ButtonLink>
      )}
      {$messageSection(message)}
    </div>
  )
}

type messageSectionProps = {
  url: string | undefined
  buttonText: string
  dataTestId?: string
  text?: React.ReactNode
}

const $messageSection = ({
  text,
  url,
  buttonText,
  dataTestId,
}: messageSectionProps): JSX.Element => (
  <Message className={colorSprinkle({ color: "foregroundMuted" })}>
    {text}&nbsp;
    <ButtonLink data-testid={dataTestId} href={url}>
      {buttonText}
    </ButtonLink>
  </Message>
)

type registrationCard = {
  nodes: UiNode[]
  loginUrl: string
  activeFlow?: "password" | "passwordless"
  selectActiveFlowAction?: ((e: React.MouseEvent) => void) | string
}

const $registrationSection = ({
  nodes,
  loginUrl,
  activeFlow,
  selectActiveFlowAction,
}: registrationCard): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <Divider />
    {activeFlow && activeFlow === "password" ? (
      <>
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            filter={{
              nodes: nodes,
              groups: ["default", "password"],
              excludeAttributes: "submit",
            }}
          />
        </div>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["password"],
            attributes: "submit",
          }}
        />
      </>
    ) : (
      $passwordlessSection(nodes)
    )}

    {selectActiveFlowAction && (
      <ButtonLink
        {...(typeof selectActiveFlowAction === "string"
          ? { href: selectActiveFlowAction }
          : { onClick: selectActiveFlowAction })}
      >
        Alternative Registration
      </ButtonLink>
    )}

    {$messageSection({
      text: "Already have an account?",
      url: loginUrl,
      buttonText: "Sign in",
      dataTestId: "login-link",
    })}
  </div>
)

type alternativeFlowCard = {
  nodes: UiNode[]
  loginUrl: string
  signupUrl: string
}

const $alternativeFlowCard = ({
  nodes,
  loginUrl,
  signupUrl,
}: alternativeFlowCard): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["default", "link"],
          excludeAttributes: "submit",
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ["link"],
        attributes: "submit",
      }}
    />
    {loginUrl &&
      $messageSection({
        text: "Already have an account?",
        url: loginUrl,
        buttonText: "Sign in",
        dataTestId: "login-link",
      })}
    {signupUrl &&
      $messageSection({
        text: "Don't have an account?",
        url: signupUrl,
        buttonText: "Sign up",
        dataTestId: "signup-link",
      })}
  </div>
)

const $oidcSection = (flow: SelfServiceFlow): JSX.Element | null => {
  const hasOIDC =
    filterNodesByGroups({
      nodes: flow.ui.nodes,
      groups: "oidc",
      withoutDefaultGroup: true,
    }).length > 0

  return hasOIDC ? (
    <SelfServiceFlowForm flow={flow}>
      <div className={gridStyle({ gap: 32 })}>
        <Divider />
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: "oidc",
            attributes: "submit",
          }}
        />
      </div>
    </SelfServiceFlowForm>
  ) : null
}

export const SelfServiceAuthCard = ({
  flow,
  title,
  flowType,
  additionalProps,
  selectActiveFlowAction,
  activeFlow,
  onFormSubmit,
  injectScripts,
}: SelfServiceAuthCardProps): JSX.Element => {
  if (injectScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let $card = null
  let $oidc = null

  let f
  let isLoggedIn = false

  switch (flowType) {
    case "login":
      $oidc = $oidcSection(flow)
      f = flow as SelfServiceLoginFlow
      // the user might need to logout on the second factor page.
      isLoggedIn = f.refresh || f.requested_aal === "aal2"
      $card = $loginSection({
        nodes: flow.ui.nodes,
        isLoggedIn,
        selectActiveFlowAction,
        activeFlow,
        ...additionalProps,
      })
      break
    case "registration":
      $oidc = $oidcSection(flow)
      $card = $registrationSection({
        nodes: flow.ui.nodes,
        selectActiveFlowAction,
        activeFlow,
        loginUrl: additionalProps.loginURL || "",
      })
      break
    // both verification and recovery use the same flow.
    case "recovery":
    case "verification":
      $card = $alternativeFlowCard({
        nodes: flow.ui.nodes,
        loginUrl: additionalProps.loginURL || "",
        signupUrl: additionalProps.signupURL || "",
      })
      break
    default:
      $card = null
  }

  return (
    <Card title={title}>
      <div className={gridStyle({ gap: 32 })}>
        {flow.ui.messages && flow.ui.messages.length > 0 && (
          <Message severity={"error"}>
            {flow.ui.messages.map((m) => m.text).join(" ")}
          </Message>
        )}
        {$oidc && $oidc}
        {$card && (
          <SelfServiceFlowForm
            flow={flow}
            submitOnEnter={true}
            onSubmit={onFormSubmit}
          >
            {$card}
          </SelfServiceFlowForm>
        )}
      </div>
    </Card>
  )
}
