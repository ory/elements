import { ButtonSocial, ButtonSocialProps } from "../react";
import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container } from './storyhelper';

export default {
    title: 'Component/ButtonSocial',
    component: ButtonSocial,
    argTypes: {
        theme: {
            options: ['light', 'dark'],
            control: { type: 'radio' }
        }
    }
} as ComponentMeta<typeof ButtonSocial>;

type ButtonSocialStoryProps = ButtonSocialProps & {
    theme: 'light' | 'dark'
}

const Template: Story<ButtonSocialStoryProps> = (args: ButtonSocialStoryProps) => (
    <Container theme={args.theme || 'light'}>
        <ButtonSocial {...args} />
    </Container>
);

export const SmallSemibold = Template.bind({});

SmallSemibold.args = {
    title: 'A Small Semibold Button',
    size: 'small',
    variant: 'semibold',
    brand: 'github'
}

export const SmallNormal = Template.bind({});

SmallNormal.args = {
    title: 'A Small Regular Button',
    size: 'small',
    variant: 'regular',
    brand: 'google'
}

export const MediumNormal = Template.bind({});

MediumNormal.args = {
    title: 'A Medium Regular Button',
    size: 'medium',
    variant: 'regular',
    brand: 'twitter'
}

export const MediumSemibold = Template.bind({});

MediumSemibold.args = {
    title: 'A Medium Semibold Button',
    size: 'medium',
    variant: 'semibold',
    brand: 'facebook'
}

export const LargeNormal = Template.bind({});

LargeNormal.args = {
    title: 'A Large Regular Button',
    size: 'large',
    variant: 'regular',
    brand: 'discord'
}

export const LargeSemibold = Template.bind({});

LargeSemibold.args = {
    title: 'A Large Semibold Button',
    size: 'large',
    variant: 'semibold',
    brand: 'microsoft'
}

export const Disabled = Template.bind({})

Disabled.args = {
    title: 'A Disabled Button',
    brand: 'google',
    disabled: true
}

export const SocialButton = Template.bind({})

SocialButton.args = {
    title: 'Google',
    brand: 'google',
    type: 'semibold'
}