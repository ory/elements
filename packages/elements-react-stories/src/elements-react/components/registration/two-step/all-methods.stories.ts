import { Registration } from "../../../pages/registration"
import { config } from "../../../utils"
import { LoginFlowFromJSON, RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Ory Elements/Two Step Registration/Methods/Everything",
  component: Registration,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Registration>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: RegistrationFlowFromJSON(
      require("$/.stub-responses/registration/two-step/all-methods/initial-form.json"),
    ),
    config,
  },
}

export const FirstStepValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/registration/two-step/all-methods/missing-fields.json"),
    ),
    config,
  },
}

export const EnterPassword: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/registration/two-step/all-methods/enter-password.json"),
    ),
    config,
  },
}

export const SecondStepValidationError: Story = {
  args: {
    flow: LoginFlowFromJSON(
      require("$/.stub-responses/registration/two-step/all-methods/password-validation-error.json"),
    ),
    config,
  },
}
