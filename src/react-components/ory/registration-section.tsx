import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../theme"
import { Divider } from "../divider"
import { MessageSection } from "./common"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type RegistrationSectionAdditionalProps = {
  loginURL?: string
}

export type RegistrationSectionProps = {
  nodes: UiNode[]
} & RegistrationSectionAdditionalProps

export const RegistrationSection = ({
  nodes,
  loginURL,
}: RegistrationSectionProps): JSX.Element => (
  <div className={gridStyle({ gap: 32 })}>
    <Divider />

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
    {MessageSection({
      text: "Already have an account?",
      url: loginURL,
      buttonText: "Sign in",
      dataTestId: "login-link",
    })}
  </div>
)
