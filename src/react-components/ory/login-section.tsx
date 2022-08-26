import React from "react"
import { UiNode } from "@ory/client"
import { gridStyle } from "../../theme"
import { ButtonLink } from "../button-link"
import { Divider } from "../divider"
import { MessageSection, MessageSectionProps } from "./common"
import { FilterFlowNodes } from "./filter-flow-nodes"

export type LoginSectionAdditionalProps = {
  forgotPasswordURL?: string
  signupURL?: string
  logoutURL?: string
}

export type LoginSectionProps = {
  nodes: UiNode[]
  isLoggedIn: boolean
} & LoginSectionAdditionalProps

export const LoginSection = ({
  nodes,
  forgotPasswordURL,
  signupURL,
  logoutURL,
  isLoggedIn,
}: LoginSectionProps): JSX.Element => {
  const message: MessageSectionProps = isLoggedIn
    ? {
        text: <>Something&#39;s not working?</>,
        buttonText: "Logout",
        url: logoutURL,
      }
    : {
        buttonText: "Sign up",
        url: signupURL,
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
      {MessageSection(message)}
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
        <ButtonLink data-testid="forgot-password-link" href={forgotPasswordURL}>
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
      {MessageSection(message)}
    </div>
  )
}
