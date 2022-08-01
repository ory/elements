import { Button, ButtonProps } from "../../react";
import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container } from '../storyhelper';

const meta: Meta = {
    title: 'LightTheme/Button',
    component: Button
};

const Template: Story<ButtonProps> = (args: ButtonProps) => (
    <Container theme={'light'}>
        <Button {...args} />
    </Container>
);

export const SmallSemibold = Template.bind({});

SmallSemibold.args = {
    title: 'A Small Semibold Button',
    size: 'small',
    type: 'semibold'
}

export const SmallNormal = Template.bind({});

SmallNormal.args = {
    title: 'A Small Regular Button',
    size: 'small',
    type: 'regular'
}

export const MediumNormal = Template.bind({});

MediumNormal.args = {
    title: 'A Medium Regular Button',
    size: 'medium',
    type: 'regular'
}

export const MediumSemibold = Template.bind({});

MediumSemibold.args = {
    title: 'A Medium Semibold Button',
    size: 'medium',
    type: 'semibold'
}

export const LargeNormal = Template.bind({});

LargeNormal.args = {
    title: 'A Large Regular Button',
    size: 'large',
    type: 'regular'
}

export const LargeSemibold = Template.bind({});

LargeSemibold.args = {
    title: 'A Large Semibold Button',
    size: 'large',
    type: 'semibold'
}

export default meta;