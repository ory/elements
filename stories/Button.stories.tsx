import React from 'react'
import { Meta } from '@storybook/react'
import { Story } from '@storybook/react/types-6-0'

import Button, { ButtonProps } from './Button'
import { Container, Spacer } from './storyhelper'

const meta: Meta = {
  title: 'Button',
  component: Button,
}

const Template: Story<ButtonProps> = (args: ButtonProps) => (
  <Container>
    <Button {...args} />
  </Container>
)

export const Playground = Template.bind({})
Playground.args = {
  children: 'Default Text',
}

export const Size = () => (
  <Container>
    <Spacer>
      <Button>Regular</Button>
    </Spacer>
    <Spacer>
      <Button big>Big</Button>
    </Spacer>
  </Container>
)

export const Hover = () => (
  <Container>
    <Spacer>
      <Button className="fake-hover">Hover</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-hover">
        Hover
      </Button>
    </Spacer>
  </Container>
)

export const Click = () => (
  <Container>
    <Spacer>
      <Button className="fake-click">Click</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-click">
        Click
      </Button>
    </Spacer>
  </Container>
)

export const Focus = () => (
  <Container>
    <Spacer>
      <Button className="fake-focus">Focus</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-focus">
        Focus
      </Button>
    </Spacer>
  </Container>
)

export const Disabled = () => (
  <Container>
    <Spacer>
      <Button disabled={true}>Disabled</Button>
    </Spacer>
    <Spacer>
      <Button big disabled={true}>
        Disabled
      </Button>
    </Spacer>
  </Container>
)

export const Helper = () => {
  const message = (
    <p>
      By creating an account, you agree to the Terms of Service. For more
      information about privacy practices, see the Privacy Statement.
    </p>
  )

  return (
    <Container>
      <Spacer>
        <Button className="fake-focus" helper={message}>
          Helper
        </Button>
      </Spacer>
      <Spacer>
        <Button big className="fake-focus" helper={message}>
          Helper
        </Button>
      </Spacer>
    </Container>
  )
}

export default meta
