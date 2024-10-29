import { SettingsFlowFromJSON } from "@ory/client-fetch"
import { Settings } from "@ory/elements-react/theme"
import { Meta, StoryObj } from "@storybook/react"
import { config } from "../../utils"

const meta = {
  title: "Ory Elements/Settings/Methods/Webauthn",
  component: Settings,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Settings>

export default meta

type Story = StoryObj<typeof meta>

export const ShowForm: Story = {
  args: {
    flow: SettingsFlowFromJSON(
      require("$/.stub-responses/settings/webauthn/initial-form.json"),
    ),
    config,
  },
}
