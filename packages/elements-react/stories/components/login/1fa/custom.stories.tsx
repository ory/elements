// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import {
  OryCard,
  OryCardContent,
  OryForm,
  OryFormGroupDivider,
  OryFormGroups,
  OryFormOidcButtons,
  OryNodeOidcButtonProps,
} from "@ory/elements-react"
import { config } from "../../../utils"

import type { Meta, StoryObj } from "@storybook/react"
import { Login, LoginFlowContextProps } from "../../../../src/theme/default"

const CustomSocialButton = ({ node }: OryNodeOidcButtonProps) => (
  <div className="antialiased rounded-buttons border border-interface-background-default-inverted leading-none bg-button-primary-background-default hover:bg-button-primary-background-hover transition-colors text-button-primary-foreground-default hover:text-button-primary-foreground-hover px-4 py-4.5 text-sm font-medium">
    Custom {node.meta.label?.text}
  </div>
)

const CustomComponents = ({ flow, config }: LoginFlowContextProps) => {
  return (
    <Login
      flow={flow}
      components={{
        Node: {
          OidcButton: CustomSocialButton,
        },
      }}
      config={config}
    >
      <OryCard>
        <OryCardContent>
          <OryForm>
            <OryFormOidcButtons />
            <OryFormGroupDivider />
            <div>
              Even though the code method is available, we do not show it here
              with our customization:
            </div>
            <OryFormGroups
              groups={["default", "password" /* "code" */, "webauthn"]}
            />
          </OryForm>
        </OryCardContent>
      </OryCard>
    </Login>
  )
}

const meta = {
  title: "Ory Elements/Custom Components",
  component: CustomComponents,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const CustomSocialSignInButton: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$snapshots/login/1fa/all-methods/initial-form.json"),
    ),
    config,
  },
}
