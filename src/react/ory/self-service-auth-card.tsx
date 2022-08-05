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

import '../../assets/flexboxgrid.min.css';

export type SelfServiceLoginProps = {
  forgotPasswordLink?: string;
  signupLink?: string;
};

export type SelfServiceRegistrationProps = {
  loginLink?: string;
};

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  title: string;
  additionalProps: SelfServiceLoginProps | SelfServiceRegistrationProps;
  icon?: string;
  ctaLink?: string;
  className?: string;
  children?: string;
};

const isLoginFlow = (
  flow: SelfServiceLoginProps | SelfServiceRegistrationProps
): flow is SelfServiceLoginProps => {
  return (flow as SelfServiceLoginProps).signupLink !== undefined;
};

const isRegistrationFlow = (
  flow: SelfServiceLoginProps | SelfServiceRegistrationProps
): flow is SelfServiceRegistrationProps => {
  return (flow as SelfServiceRegistrationProps).loginLink !== undefined;
};

export const SelfServiceAuthCard = ({
  flow,
  title,
  additionalProps,
  ctaLink
}: SelfServiceAuthCardProps) => {
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
        <div className={gridStyle({ gap: 32 })}>
          <div className={gridStyle({ gap: 16 })}>
            <FilterFlowNodes
              filter={{
                nodes: flow.ui.nodes,
                groups: ['default', 'password'],
                excludeAttributes: 'submit'
              }}
            />
            {isLoginFlow(additionalProps) && (
              <ButtonLink href={ctaLink}>Forgot Password?</ButtonLink>
            )}
          </div>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ['password'],
              attributes: 'submit'
            }}
          />
          <Message className={colorStyle({ color: 'foregroundMuted' })}>
            {isRegistrationFlow(additionalProps) ? (
              <>
                Already have an account?&nbsp;
                <ButtonLink href={additionalProps.loginLink}>
                  Sign in
                </ButtonLink>
              </>
            ) : (
              <>
                Don't have an account?&nbsp;
                <ButtonLink href={additionalProps.signupLink}>
                  Sign up
                </ButtonLink>
              </>
            )}
          </Message>
        </div>
      </SelfServiceFlowForm>
    </Card>
  );
};
