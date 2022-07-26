import {Meta} from "@storybook/react";
import {Story} from "@storybook/react/types-6-0";
import {Container} from "../storyhelper";
import React from "react";
import {Divider} from "../../react/divider";

const meta: Meta = {
  title: 'DarkTheme/Divider',
  component: Divider
};

const Template: Story = () => (
  <Container theme={'dark'}>
    <Divider />
  </Container>
);

export const Playground = Template.bind({});

export default meta;
