import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../theme"
import { MessageSection } from "./common"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type LinkSectionAdditionalProps = {
  loginURL?: string
  signupURL?: string
}

export type LinkSectionProps = {
  nodes: UiNode[]
} & LinkSectionAdditionalProps

export const LinkSection = ({
  nodes,
  loginURL,
  signupURL,
}: LinkSectionProps): JSX.Element => (
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
    {loginURL &&
      MessageSection({
        text: "Already have an account?",
        url: loginURL,
        buttonText: "Sign in",
        dataTestId: "login-link",
      })}
    {signupURL &&
      MessageSection({
        text: "Don't have an account?",
        url: signupURL,
        buttonText: "Sign up",
        dataTestId: "signup-link",
      })}
  </div>
)
