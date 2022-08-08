import React from 'react';
import { Card } from '../card';
import { Divider } from '../divider';
import { FilterFlowNodes } from './filter-flow-nodes';
import { SelfServiceFlow } from './FlowTypes';
import { SelfServiceFlowForm } from './selfservice-flow-form';
import { ButtonLink } from '../button-link';
import { Message } from '../message';
import { colorStyle } from '../../theme/color.css';
import { gridStyle } from '../../theme';
import {
  SelfServiceLoginFlow,
  SelfServiceRegistrationFlow,
  UiNode
} from '@ory/client';

import '../../assets/flexboxgrid.min.css';

export type SelfServiceLoginProps = {
  forgotPasswordUrl?: string;
  signupUrl?: string;
  logoutUrl?: string;
};

export type SelfServiceRegistrationProps = {
  loginUrl?: string;
};

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  title: string;
  additionalProps: SelfServiceLoginProps | SelfServiceRegistrationProps;
  icon?: string;
  className?: string;
  children?: string;
};

const isLoginFlow = (
  flow: SelfServiceLoginProps | SelfServiceRegistrationProps
): flow is SelfServiceLoginProps => {
  return (flow as SelfServiceLoginProps).signupUrl !== undefined;
};

const isRegistrationFlow = (
  flow: SelfServiceLoginProps | SelfServiceRegistrationProps
): flow is SelfServiceRegistrationProps => {
  return (flow as SelfServiceRegistrationProps).loginUrl !== undefined;
};

type loginCardProps = {
  nodes: UiNode[];
  isLoggedIn: boolean;
} & SelfServiceLoginProps;

const loginCard = ({
  nodes,
  forgotPasswordUrl,
  signupUrl,
  logoutUrl,
  isLoggedIn
}: loginCardProps) => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ['default', 'password'],
          excludeAttributes: 'submit'
        }}
      />
      <ButtonLink href={forgotPasswordUrl}>Forgot Password?</ButtonLink>
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ['password'],
        attributes: 'submit'
      }}
    />
    <Message className={colorStyle({ color: 'foregroundMuted' })}>
      {isLoggedIn ? (
        <ButtonLink href={logoutUrl}>Logout</ButtonLink>
      ) : (
        <>
          Don't have an account?&nbsp;
          <ButtonLink href={signupUrl}>Sign up</ButtonLink>
        </>
      )}
    </Message>
  </div>
);

type registrationCard = {
  nodes: UiNode[];
} & SelfServiceRegistrationProps;

const registrationCard = ({ nodes, loginUrl }: registrationCard) => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ['default', 'password'],
          excludeAttributes: 'submit'
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ['password'],
        attributes: 'submit'
      }}
    />
    <Message className={colorStyle({ color: 'foregroundMuted' })}>
      Already have an account?&nbsp;
      <ButtonLink href={loginUrl}>Sign in</ButtonLink>
    </Message>
  </div>
);

export const SelfServiceAuthCard = ({
  flow,
  title,
  additionalProps
}: SelfServiceAuthCardProps) => {
  let $card;

  if (isLoginFlow(additionalProps)) {
    const f = flow as SelfServiceLoginFlow;
    // the user might need to logout on the second factor page.
    const isLoggedIn = f.refresh || f.requested_aal === 'aal2';
    $card = loginCard({ nodes: flow.ui.nodes, isLoggedIn, ...additionalProps });
  } else if (isRegistrationFlow(additionalProps)) {
    const f = flow as SelfServiceRegistrationFlow;
    $card = registrationCard({ nodes: flow.ui.nodes, ...additionalProps });
  }

  return (
    <Card title={title}>
      <SelfServiceFlowForm flow={flow}>
        <div className={gridStyle({ gap: 32 })}>
          <Divider />
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ['oidc'],
              attributes: 'submit'
            }}
          />
          <Divider />
        </div>
      </SelfServiceFlowForm>
      <SelfServiceFlowForm flow={flow} submitOnEnter={true}>
        {$card}
      </SelfServiceFlowForm>
    </Card>
  );
};
