import { Button, ButtonProps } from "../../react";
import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container } from '../storyhelper';

const meta: Meta = {
    title: 'DarkTheme/Button',
    component: Button
};

const Template: Story<ButtonProps> = (args: ButtonProps) => (
    <Container theme={'dark'}>
        <Button {...args} />
    </Container>
);

export const Playground = Template.bind({});

Playground.args = {
    title: 'A Small Regular Button',
    size: 'small',
    type: 'regular'
}

export default meta;