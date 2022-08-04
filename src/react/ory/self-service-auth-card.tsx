import React from 'react';
import { SelfServiceLoginFlow } from '@ory/client';
import { Card } from '../card';
import { Divider } from '../divider';
import { FilterFlowNodes } from './filter-flow-nodes';
import { SelfServiceFlow } from './FlowTypes';
import { SelfServiceFlowForm } from './selfservice-flow-form';
import { ButtonLink } from '../button-link';
import { Message } from '../message';
import { colorStyle } from '../../theme/color.css';

import '../../assets/flexboxgrid.min.css';
import { gridStyle } from '../../theme';

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  title: string;
  alternativeFlowLink: string;
  icon?: string;
  ctaLink?: string;
  className?: string;
  children?: string;
};

const loginAuthCard = (flow: SelfServiceLoginFlow) => (
  <Card title={'Sign in'}>
    <SelfServiceFlowForm flow={flow}>
      <FilterFlowNodes flow={flow} groups={['oidc']} />
      <Divider />
      <FilterFlowNodes
        flow={flow}
        groups={['password', 'default']}
        inputTypes={['input', 'text']}
      />
    </SelfServiceFlowForm>
  </Card>
);

export const SelfServiceAuthCard = ({
  flow,
  title,
  alternativeFlowLink,
  ctaLink
}: SelfServiceAuthCardProps) => {
  return (
    <Card title={title}>
      <SelfServiceFlowForm flow={flow} className={gridStyle({ gap: 32 })}>
        <Divider />
        <FilterFlowNodes flow={flow} groups={['oidc']} />
        <Divider />
      </SelfServiceFlowForm>
      <SelfServiceFlowForm
        flow={flow}
        submitOnEnter={true}
        className={gridStyle({ gap: 32 })}
      >
        <div className={gridStyle({ gap: 16 })}>
          <FilterFlowNodes
            flow={flow}
            groups={['password', 'default']}
            inputTypes={['text', 'password']}
          />
          <ButtonLink href={ctaLink}>Forgot Password?</ButtonLink>
        </div>
        <FilterFlowNodes
          flow={flow}
          groups={['password']}
          inputTypes={['submit']}
        />
      </SelfServiceFlowForm>
      <Message className={colorStyle({ color: 'foregroundMuted' })}>
        Don't have an account?{' '}
        <ButtonLink href={alternativeFlowLink}>Sign up</ButtonLink>
      </Message>
    </Card>
  );
};
