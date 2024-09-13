import {
  HeadlessSocialButtonProps,
  OryCard,
  OryCardContent,
  OryForm,
  OryFormGroups,
  OryFormSocialButtons,
} from "@ory/elements-react"
import { FlowContextProps, Login } from "../../../pages/login"
import { config } from "../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"

import type { Meta, StoryObj } from "@storybook/react"

const CustomSocialButton = ({ node }: HeadlessSocialButtonProps) => (
  <div
    className={
      "antialiased rounded-border-radius-buttons border border-transparent gap-3 leading-none bg-button-primary-bg-default hover:bg-button-primary-bg-hover transition-colors text-button-primary-fg-default hover:text-button-primary-fg-hover px-4 py-4.5 text-sm font-medium"
    }
  >
    Custom {node.meta.label?.text}
  </div>
)

const CustomComponents = ({ flow, config }: FlowContextProps) => {
  return (
    <Login
      flow={flow}
      components={{
        SocialButton: CustomSocialButton,
      }}
      config={config}
    >
      <OryCard>
        <OryCardContent>
          <OryForm>
            <OryFormSocialButtons />
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
      require("$/.stub-responses/login/1fa/all-methods/initial-form.json"),
    ),
    config,
  },
}
