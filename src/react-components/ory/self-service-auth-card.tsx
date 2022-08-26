import React from "react"
import { Card } from "../card"
import {
  SelfServiceFlowForm,
  SelfServiceFlowFormAdditionalProps,
} from "./selfservice-flow-form"
import { Message } from "../message"
import { gridStyle } from "../../theme"
import { SelfServiceLoginFlow } from "@ory/client"
import { useScriptNodes } from "./node-script"
import { SelfServiceFlow } from "../../types"
import { OIDCSection } from "./oidc-section"
import { LoginSectionAdditionalProps, LoginSection } from "./login-section"
import {
  RegistrationSection,
  RegistrationSectionAdditionalProps,
} from "./registration-section"
import { LinkSection, LinkSectionAdditionalProps } from "./login-two-factor"
import { PasswordlessSection } from "./passwordless-section"
import { Divider } from "../divider"

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow
  title: string
  flowType: "login" | "registration" | "recovery" | "verification"
  additionalProps:
    | LoginSectionAdditionalProps
    | RegistrationSectionAdditionalProps
    | LinkSectionAdditionalProps
  injectScripts?: boolean
  icon?: string
  className?: string
  children?: string
} & SelfServiceFlowFormAdditionalProps

export const SelfServiceAuthCard = ({
  flow,
  title,
  flowType,
  additionalProps,
  onSubmit,
  injectScripts,
}: SelfServiceAuthCardProps): JSX.Element => {
  if (injectScripts) {
    useScriptNodes({ nodes: flow.ui.nodes })
  }

  let $flow = null
  let $oidc = null
  let $passwordless = null

  let f
  let isLoggedIn = false

  switch (flowType) {
    case "login":
      $passwordless = PasswordlessSection(flow)
      $oidc = OIDCSection(flow)
      f = flow as SelfServiceLoginFlow
      // the user might need to logout on the second factor page.
      isLoggedIn = f.refresh || f.requested_aal === "aal2"
      $flow = LoginSection({
        nodes: flow.ui.nodes,
        isLoggedIn,
        ...additionalProps,
      })
      break
    case "registration":
      $passwordless = PasswordlessSection(flow)
      $oidc = OIDCSection(flow)
      $flow = RegistrationSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      })
      break
    // both verification and recovery use the same flow.
    case "recovery":
    case "verification":
      $flow = LinkSection({
        nodes: flow.ui.nodes,
        ...additionalProps,
      })
      break
    default:
      $flow = null
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
        {$flow && (
          <SelfServiceFlowForm
            flow={flow}
            submitOnEnter={true}
            onSubmit={onSubmit}
          >
            {$flow}
          </SelfServiceFlowForm>
        )}
        <Divider text="or" />
        {$passwordless && (
          <SelfServiceFlowForm
            flow={flow}
            submitOnEnter={true}
            onSubmit={onSubmit}
          >
            {$passwordless}
          </SelfServiceFlowForm>
        )}
      </div>
    </Card>
  )
}
