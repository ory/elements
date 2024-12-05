// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { ButtonSocial, ButtonSocialProps } from "../react-components"
import { Container } from "./storyhelper"

export default {
  title: "Component/ButtonSocial",
  component: ButtonSocial,
} as Meta<typeof ButtonSocial>

const Template: StoryFn<ButtonSocialProps> = (args: ButtonSocialProps) => (
  <Container>
    <ButtonSocial {...args} />
  </Container>
)

export const SmallSemibold = Template.bind({})

SmallSemibold.args = {
  header: "A Small Semibold Button",
  size: "small",
  variant: "semibold",
  brand: "github",
}

export const SmallNormal = Template.bind({})

SmallNormal.args = {
  header: "A Small Regular Button",
  size: "small",
  variant: "regular",
  brand: "google",
}

export const MediumNormal = Template.bind({})

MediumNormal.args = {
  header: "A Medium Regular Button",
  size: "medium",
  variant: "regular",
  brand: "twitter",
}

export const MediumSemibold = Template.bind({})

MediumSemibold.args = {
  header: "A Medium Semibold Button",
  size: "medium",
  variant: "semibold",
  brand: "facebook",
}

export const LargeNormal = Template.bind({})

LargeNormal.args = {
  header: "A Large Regular Button",
  size: "large",
  variant: "regular",
  brand: "discord",
}

export const LargeSemibold = Template.bind({})

LargeSemibold.args = {
  header: "A Large Semibold Button",
  size: "large",
  variant: "semibold",
  brand: "microsoft",
}

export const Disabled = Template.bind({})

Disabled.args = {
  header: "A Disabled Button",
  brand: "google",
  disabled: true,
}

export const SocialButton = Template.bind({})

SocialButton.args = {
  header: "Google",
  brand: "google",
}

export const GenericProviderButton = Template.bind({})

GenericProviderButton.args = {
  header: "Generic Provider",
  brand: "generic",
}

export const FullWidthSocialButton = Template.bind({})

FullWidthSocialButton.args = {
  header: "Hi",
  brand: "google",
  fullWidth: true,
}
