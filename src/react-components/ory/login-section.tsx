import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../theme"
import { ButtonLink } from "../button-link"
import { Divider } from "../divider"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type LoginSectionProps = {
  nodes: UiNode[]
  isLoggedIn: boolean
  forgotPasswordURL?: string
}

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
  isLoggedIn,
}: LoginSectionProps): JSX.Element | null => {
  return isLoggedIn ? (
    <div className={gridStyle({ gap: 32 })}>
      <Divider />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          excludeAttributes: "hidden",
        }}
      />
    </div>
  ) : (
    <div className={gridStyle({ gap: 32 })}>
      <Divider />
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
