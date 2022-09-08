import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../../theme"
import { ButtonLink } from "../../button-link"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { NodeMessages } from "../helpers/error-messages"
import { filterNodesByGroups } from "@ory/integrations/ui"

export type LoginSectionProps = {
  nodes: UiNode[]
  forgotPasswordURL?: string
}

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
}: LoginSectionProps): JSX.Element | null => {
  return (
    <div className={gridStyle({ gap: 32 })}>
      <NodeMessages
        nodes={filterNodesByGroups({ nodes: nodes, groups: "password" })}
      />
      <div className={gridStyle({ gap: 16 })}>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["default", "password"],
            excludeAttributes: ["submit", "hidden"],
          }}
        />
        {forgotPasswordURL && (
          <ButtonLink
            data-testid="forgot-password-link"
            href={forgotPasswordURL}
          >
            Forgot Password?
          </ButtonLink>
        )}
      </div>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["password"],
          attributes: "submit",
        }}
      />
    </div>
  )
}
