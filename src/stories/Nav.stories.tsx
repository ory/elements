import { ComponentMeta, Story } from '@storybook/react';
import { Nav, NavProps } from '../react-components/nav';
import { Container } from './storyhelper';

export default {
  title: 'Component/Nav',
  component: Nav,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Nav>;

export type MessageStoryProps = NavProps & {
  theme: 'light' | 'dark';
};

const Template: Story<MessageStoryProps> = (args: MessageStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Nav {...args} />
  </Container>
);

export const DefaultNav = Template.bind({});

DefaultNav.args = {
  navTitle: 'Project Name',
  navSections: [
    {
      links: [
        {
          name: 'Overview',
          url: '/overview',
          iconLeft: 'house'
        },
        {
          name: 'Session Information',
          url: '/session-information',
          iconLeft: 'code',
          disabled: true
        }
      ]
    },
    {
      title: 'Default User Interface',
      titleIcon: 'circle-question',
      links: [
        {
          name: 'Sign In',
          url: '/signin',
          iconLeft: 'arrow-right-to-bracket',
          iconRight: 'up-right-from-square',
          disabled: false
        }
      ]
    }
  ]
};
