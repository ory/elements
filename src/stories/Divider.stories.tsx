import { Divider, DividerProps } from "../react-components"
import { Container } from "./storyhelper"
import { ComponentMeta, Story } from "@storybook/react"

export default {
  title: "Component/Divider",
  component: Divider,
} as ComponentMeta<typeof Divider>

const Template: Story<DividerProps> = (args: DividerProps) => (
  <Container>
    <Divider {...args} />
  </Container>
)

export const DefaultDivider = Template.bind({})

export const FullWidthDivider = Template.bind({})

FullWidthDivider.args = {
  fullWidth: true,
}
