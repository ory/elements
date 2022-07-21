import React from "react";
import Divider, {DividerProps} from "../../components/Divider";
import {Story} from "@storybook/react/types-6-0";
import {Container, Spacer} from "./storyhelper";
import {Meta} from "@storybook/react";

const meta: Meta = {
  title: 'Divider',
  component: Divider
};

const Template: Story<DividerProps> = (args: DividerProps) => (
  <Container>
    <Divider {...args} />
  </Container>
);

export const Playground = Template.bind({});

Playground.args = {};

export const Dividers = () => (
  <Container>
    <Spacer>
      <h2>Default Divider</h2>
      <Divider/>
    </Spacer>
    <Spacer>
      <h2>Divider 64px width and 32px height</h2>
      <Divider width={"64px"} height={"32px"}></Divider>
    </Spacer>
  </Container>
);

export default meta;
