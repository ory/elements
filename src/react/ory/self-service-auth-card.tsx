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

export type AdditionalProps = {
  forgotPasswordUrl?: string;
  signupUrl?: string;
  logoutUrl?: string;
  loginUrl?: string;
};

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  title: string;
  flowType: 'login' | 'registration' | 'recovery' | 'verification';
  additionalProps: AdditionalProps;
  icon?: string;
  className?: string;
  children?: string;
};

type loginCardProps = {
  nodes: UiNode[];
  isLoggedIn: boolean;
} & AdditionalProps;

const $loginSection = ({
  nodes,
  forgotPasswordUrl,
  signupUrl,
  logoutUrl,
  isLoggedIn
}: loginCardProps) => (
  <div className={gridStyle({ gap: 32 })}>
    <Divider />
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
    <Message className={colorStyle({ themeColor: 'foregroundMuted' })}>
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

const $messageSection = (text: string, url: string, buttonText: string) => (
  <Message className={colorStyle({ themeColor: 'foregroundMuted' })}>
    {text}&nbsp;
    <ButtonLink href={url}>{buttonText}</ButtonLink>
  </Message>
);

type registrationCard = {
  nodes: UiNode[];
  loginUrl: string;
};

const registrationCard = ({ nodes, loginUrl }: registrationCard) => (
  <div className={gridStyle({ gap: 32 })}>
    <Divider />
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
    {$messageSection('Already have an account?', loginUrl, 'Sign in')}
  </div>
);

type alternativeFlowCard = {
  nodes: UiNode[];
  loginUrl: string;
  signupUrl: string;
};

const alternativeFlowCard = ({
  nodes,
  loginUrl,
  signupUrl
}: alternativeFlowCard) => (
  <div className={gridStyle({ gap: 32 })}>
    <div className={gridStyle({ gap: 16 })}>
      <FilterFlowNodes
        filter={{
          nodes: nodes,
          groups: ['default', 'link'],
          excludeAttributes: 'submit'
        }}
      />
    </div>
    <FilterFlowNodes
      filter={{
        nodes: nodes,
        groups: ['link'],
        attributes: 'submit'
      }}
    />
    {loginUrl &&
      $messageSection('Already have an account?', loginUrl, 'Sign in')}
    {signupUrl &&
      $messageSection("Don't have an account?", signupUrl, 'Sign up')}
  </div>
);

const errorCard = ({}) => {
  return (
    <Message className={colorStyle({ themeColor: 'foregroundMuted' })}>
      An error occurred. Please try again later.
    </Message>
  );
};

const $oidcSection = (flow: SelfServiceFlow) => (
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
    </div>
  </SelfServiceFlowForm>
);

const $flowErrorMessagesSection = (flow: SelfServiceFlow) => (
  <div className={gridStyle({ gap: 32 })}>
    {flow.ui.messages &&
      flow.ui.messages.length > 0 &&
      flow.ui.messages?.map((message) => {
        return (
          <Message severity="error" data-testid={`ui/message/${message.id}`}>
            {message.text}
          </Message>
        );
      })}
  </div>
);

export const SelfServiceAuthCard = ({
  flow,
  title,
  flowType,
  additionalProps
}: SelfServiceAuthCardProps) => {
  let $card = null;
  let $oidc = null;

  switch (flowType) {
    case 'login':
      $oidc = $oidcSection(flow);
      const f = flow as SelfServiceLoginFlow;
      // the user might need to logout on the second factor page.
      const isLoggedIn = f.refresh || f.requested_aal === 'aal2';
      $card = $loginSection({
        nodes: flow.ui.nodes,
        isLoggedIn,
        ...additionalProps
      });
      break;
    case 'registration':
      $oidc = $oidcSection(flow);
      $card = registrationCard({
        nodes: flow.ui.nodes,
        loginUrl: additionalProps.loginUrl!
      });
      break;
    // both verification and recovery use the same flow.
    case 'recovery':
    case 'verification':
      $card = alternativeFlowCard({
        nodes: flow.ui.nodes,
        loginUrl: additionalProps.loginUrl!,
        signupUrl: additionalProps.signupUrl!
      });
      break;
    default:
      $card = errorCard;
  }

  return (
    <Card title={title}>
      <div className={gridStyle({ gap: 32 })}>
        {$flowErrorMessagesSection(flow)}
        {$oidc}
        <SelfServiceFlowForm flow={flow} submitOnEnter={true}>
          {$card}
        </SelfServiceFlowForm>
      </div>
    </Card>
  );
};
