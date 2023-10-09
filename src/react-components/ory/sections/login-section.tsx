import { UiNode } from "@ory/client"
import { JSX } from "react"
import { FormattedMessage } from "react-intl"

import { gridStyle } from "../../../theme"
import { ButtonLink, CustomHref } from "../../button-link"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword } from "../helpers/utils"

export interface LoginSectionProps {
  nodes: UiNode[]
  forgotPasswordURL?: CustomHref | string
}

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
}: LoginSectionProps): JSX.Element | null => {
  return hasPassword(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
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
        }}
      />
    </div>
  ) : null
}
