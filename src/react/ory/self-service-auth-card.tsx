import React from 'react';
import { Card } from '../card';
import { Divider } from '../divider';
import { FilterFlowNodes } from './filter-flow-nodes';
import { SelfServiceFlow } from './FlowTypes';
import { SelfServiceFlowForm } from './selfservice-flow-form';

export type SelfServiceAuthCardProps = {
  flow: SelfServiceFlow;
  className?: string;
  children?: string;
};

export const SelfServiceAuthCard = ({
  flow,
  className,
  children
}: SelfServiceAuthCardProps) => {
  return (
    <Card title={'Sign in'}>
      <SelfServiceFlowForm flow={flow}>
        <FilterFlowNodes flow={flow} groups={['oidc']} />
        <Divider />
        <FilterFlowNodes
          flow={flow}
          groups={['password', 'default']}
          inputTypes={['input']}
        />
      </SelfServiceFlowForm>
    </Card>
  );
};
