import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import SocialButton, {SocialButtonProps} from "../components/SocialButton";
import {Container, Spacer} from "./storyhelper";

const meta: Meta = {
  title: 'SocialButton',
  component: SocialButton
};

const Template: Story<SocialButtonProps> = (args: SocialButtonProps) => (
  <Container>
    <SocialButton {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  children: 'Default Text'
};

export const Size = () => (
  <Container>
    <Spacer>
      <SocialButton size={"small"} brand={"google"}>Small</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton brand={"google"}>Regular</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton size={"large"} brand={"google"}>Large</SocialButton>
    </Spacer>
  </Container>
);

export const Brands = () => (
  <Container>
    <Spacer>
      <SocialButton brand={"google"}>Google</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton brand={"apple"}>Apple</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton brand={"facebook"}>Facebook</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton brand={"twitter"}>Twitter</SocialButton>
    </Spacer>
    <Spacer>
      <SocialButton brand={"discord"}>Discord</SocialButton>
    </Spacer>
  </Container>
)

export default meta;
