import React from "react"
import { ComponentMeta, Story } from "@storybook/react"
import { Container } from "./storyhelper"
import { Card, Nav, NavProps } from "../react-components"

export default {
  title: "Component/Nav",
  component: Nav,
} as ComponentMeta<typeof Nav>

const Template: Story<NavProps> = (args: NavProps) => (
  <Container>
    <div
      style={{
        padding: 0,
        minHeight: "100vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        margin: 0,
      }}
    >
      <Nav {...args} />
      <Card header={"Content Below Nav"}>
        <p>Some content to test how the nav behaves</p>
      </Card>
    </div>
  </Container>
)

export const DefaultNav = Template.bind({})

DefaultNav.args = {
  navTitle: "Project Name",
  navSections: [
    {
      links: [
        {
          name: "Overview",
          url: "/overview",
          iconLeft: "house",
        },
        {
          name: "Session Information",
          url: "/session-information",
          iconLeft: "code",
          disabled: true,
        },
      ],
    },
    {
      title: "Default User Interface",
      titleIcon: "circle-question",
      links: [
        {
          name: "Sign In",
          url: "/signin",
          iconLeft: "arrow-right-to-bracket",
          iconRight: "up-right-from-square",
          disabled: false,
        },
      ],
    },
    {
      floatBottom: true,
      links: [
        {
          name: "Back to overview",
          url: "/overview",
          iconLeft: "arrow-left-to-bracket",
          iconRight: "down-right-from-square",
        },
      ],
    },
  ],
}
