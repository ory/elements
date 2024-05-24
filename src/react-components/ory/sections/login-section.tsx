import { UiNode } from "@ory/client"
import { JSX } from "react"
import { FormattedMessage } from "react-intl"

import { gridStyle } from "../../../theme"
import { ButtonLink, CustomHref } from "../../button-link"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword, hasTwoStep } from "../helpers/utils"
import { SelfServiceFlow } from "../helpers/types"

export interface LoginSectionProps {
  nodes: UiNode[]
  forgotPasswordURL?: CustomHref | string
}

export const TwoStepLoginSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  const nodes = flow.ui.nodes
  return hasTwoStep(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["default", "two_step"],
          excludeAttributeTypes: ["submit", "hidden"],
        }}
      />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["two_step"],
          attributes: "submit",
        }}
      />
    </div>
  ) : null
}

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
}: LoginSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["link", "code", "two_step"],
          attributes: ["hidden"],
        }}
      />
      <div className={gridStyle({ gap: 32 })}>
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            filter={{
              nodes: nodes,
              groups: ["default", "password"],
              excludeAttributeTypes: ["submit", "hidden"],
            }}
          />
          {forgotPasswordURL && (
            <ButtonLink
              data-testid="forgot-password-link"
              href={forgotPasswordURL}
            >
              <FormattedMessage
                id="login.forgot-password"
                defaultMessage="Forgot password?"
              />
            </ButtonLink>
          )}
        </div>
        <FilterFlowNodes
          filter={{
            nodes: nodes,
            groups: ["password"],
            attributes: "submit",
            excludeAttributeTypes: ["hidden"],
          }}
        />
      </div>
    </>
  ) : null
}
