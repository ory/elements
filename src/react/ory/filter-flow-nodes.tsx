import { UiNode, UiNodeTypeEnum } from '@ory/client';
import {
  filterNodesByGroups,
  getNodeInputType,
  isUiNodeInputAttributes
} from '@ory/integrations/ui';
import { Node } from './node';
import { gridStyle } from '../../theme';
import React from 'react';

export interface Props {
  filter: filterNodesByGroups;
  flowType?: 'login' | 'registration';
  includeCSRF?: boolean;
}

export const FilterFlowNodes = ({ flowType, filter, includeCSRF }: Props) => {
  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : '';

  const nodes = filterNodesByGroups(filter)
    // we don't want to map the csrf token every time, only on the form level
    .filter((node) => includeCSRF || getInputName(node) !== 'csrf_token')
    .map((node, k) =>
      ['hidden'].includes(getNodeInputType(node.attributes))
        ? { node: <Node node={node} key={k} />, hidden: true }
        : { node: <Node node={node} key={k} />, hidden: false }
    );
  return (
    <>
      {nodes.filter((node) => node.hidden).map((node) => node.node)}
      <div className={gridStyle({ gap: 16 })}>
        {nodes.filter((node) => !node.hidden).map((node) => node.node)}
      </div>
    </>
  );
};
