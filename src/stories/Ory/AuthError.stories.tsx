import { FlowError } from "@ory/client"
import { ComponentMeta, Story } from "@storybook/react"
import { UserErrorCard, UserErrorCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import authError400 from "./auth-error-400.json"
import authError500 from "./auth-error-500.json"

export default {
  title: "Ory/ErrorAuthCard",
  component: UserErrorCard,
} as ComponentMeta<typeof UserErrorCard>

const Template: Story<UserErrorCardProps> = (args: UserErrorCardProps) => (
  <Container>
    <UserErrorCard {...args} />
  </Container>
)

export const ErrorAuthCard400 = Template.bind({})

ErrorAuthCard400.args = {
  error: authError400 as FlowError,
  backUrl: "https://acme.com/login",
  contactSupportEmail: "help@help.com",
}

export const ErrorAuthCard500 = Template.bind({})

ErrorAuthCard500.args = {
  error: authError500 as FlowError,
  backUrl: "https://acme.com/login",
  contactSupportEmail: "help@help.com",
}
