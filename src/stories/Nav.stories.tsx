import { ComponentMeta, Story } from "@storybook/react"
import { Card, Nav, NavProps } from "../react-components"
import { Container } from "./storyhelper"

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
      <Card heading={"Content Below Nav"}>
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
          href: "/overview",
          iconLeft: "house",
          target: "_blank",
        },
        {
          name: "Session Information",
          href: "/session-information",
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
          href: "/signin",
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
          href: "/overview",
          iconLeft: "arrow-left-to-bracket",
          iconRight: "down-right-from-square",
        },
      ],
    },
  ],
}

export const SelectedNav = Template.bind({})

SelectedNav.args = {
  navTitle: "Project Name",
  navSections: [
    {
      links: [
        {
          name: "Overview",
          href: "/overview",
          iconLeft: "house",
          selected: true,
        },
        {
          name: "Session Information",
          href: "/session-information",
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
          href: "/signin",
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
          href: "/overview",
          iconLeft: "arrow-left-to-bracket",
          iconRight: "down-right-from-square",
        },
      ],
    },
  ],
}
