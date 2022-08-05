import React from 'react';
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

export const SelfServiceAuthCard = ({
  flow,
  title,
  alternativeFlowLink,
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
            <ButtonLink href={ctaLink}>Forgot Password?</ButtonLink>
          </div>
          <FilterFlowNodes
            filter={{
              nodes: flow.ui.nodes,
              groups: ['password'],
              attributes: 'submit'
            }}
          />
        </div>
      </SelfServiceFlowForm>
      <Message className={colorStyle({ color: 'foregroundMuted' })}>
        Don't have an account?{' '}
        <ButtonLink href={alternativeFlowLink}>Sign up</ButtonLink>
      </Message>
    </Card>
  );
};
