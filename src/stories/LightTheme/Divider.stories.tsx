import {Meta} from "@storybook/react";
import {Divider} from "../../react/divider";
import {Story} from "@storybook/react/types-6-0";
import {Container} from "../storyhelper";
import React from "react";

const meta: Meta = {
  title: 'LightTheme/Divider',
  component: Divider
};

const Template: Story = () => (
  <Container theme={'light'}>
    <Divider />
  </Container>
);

export const Playground = Template.bind({});

export default meta;
