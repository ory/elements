// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { JSX } from "react"
import { FormattedMessage } from "react-intl"

import { gridStyle } from "../../../theme"
import { ButtonLink, CustomHref } from "../../button-link"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasPassword, hasIdentifierFirst } from "../helpers/utils"
import { SelfServiceFlow } from "../helpers/types"
import { CaptchaSection } from "../helpers/captcha"

export interface LoginSectionProps {
  nodes: UiNode[]
  forgotPasswordURL?: CustomHref | string
}

export const IdentifierFirstLoginSection = (
  flow: SelfServiceFlow,
): JSX.Element | null => {
  const nodes = flow.ui.nodes
  return hasIdentifierFirst(nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["default", "identifier_first"],
          excludeAttributeTypes: ["submit", "hidden"],
        }}
      />
      <CaptchaSection nodes={nodes} />
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ["identifier_first"],
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
          groups: ["link", "code", "identifier_first"],
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
        <CaptchaSection nodes={nodes} />
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
