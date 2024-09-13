import { LoginFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"
import { Login } from "../../../pages/login"
import { config } from "../../../utils"

const meta = {
  title: "Ory Elements/First Factor Login/Methods/Everything",
  component: Login,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Login>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const ValidationMissingFields: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/all-methods/missing-email.json"),
    ),
    config,
  },
}

export const ValidationIncorrectCredentials: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/login/1fa/all-methods/wrong-credentials.json"),
    ),
    config,
  },
}
