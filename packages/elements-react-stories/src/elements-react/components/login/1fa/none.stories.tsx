import { config } from "../../../utils"
import { LoginFlowFromJSON } from "@ory/client-fetch"
import { Login } from "@ory/elements-react/theme"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Ory Elements/First Factor Login/Methods/None",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const NoMethodsAvailable: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/none/initial-form.json"),
    ),
    config,
  },
}
