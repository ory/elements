import { ComponentMeta } from "@storybook/react";
import { Divider } from "../react/divider";
import { Story } from "@storybook/react/types-6-0";
import { Container } from "./storyhelper";
import React from "react";

export default {
  title: 'Component/Divider',
  component: Divider,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Divider>;

type DividerStoryProps = {
  theme: 'light' | 'dark'
}

const Template: Story<DividerStoryProps> = (args: DividerStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Divider />
  </Container>
);

export const DefaultDivider = Template.bind({});