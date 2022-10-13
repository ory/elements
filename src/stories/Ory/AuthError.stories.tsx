import { SelfServiceError } from "@ory/client"
import { ComponentMeta, Story } from "@storybook/react"
import { UserErrorCard, UserErrorCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import authError from "./auth-error.json"

export default {
  title: "Ory/SelfServiceErrorCard",
  component: UserErrorCard,
} as ComponentMeta<typeof UserErrorCard>

const Template: Story<UserErrorCardProps> = (args: UserErrorCardProps) => (
  <Container>
    <UserErrorCard {...args} />
  </Container>
)

export const ErrorAuthCard = Template.bind({})

ErrorAuthCard.args = {
  title: "An error occurred",
  error: authError as SelfServiceError,
  backUrl: "https://acme.com/login",
  contactSupportEmail: "help@help.com",
}
