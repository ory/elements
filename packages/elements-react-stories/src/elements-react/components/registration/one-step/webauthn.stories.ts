import { Registration } from "../../../pages/registration"
import { config } from "../../../utils"
import { RegistrationFlowFromJSON } from "@ory/client-fetch"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Ory Elements/One Step Registration/Methods/WebAuthn",
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
      require("$/.stub-responses/registration/one-step/webauthn/initial-form.json"),
    ),
    config,
  },
}
