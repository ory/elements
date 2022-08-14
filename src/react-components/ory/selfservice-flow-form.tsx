import React from 'react';
import { SelfServiceFlowFormProps } from '../../component-types';
import { FilterFlowNodes } from './filter-flow-nodes';

export const SelfServiceFlowForm = ({
  flow,
  children,
  submitOnEnter,
  className
}: SelfServiceFlowFormProps) => {
  return (
    <form
      className={className}
      action={flow.ui.action}
      method={flow.ui.method}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !submitOnEnter) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <>
        {/*always add csrf token to form*/}
        <FilterFlowNodes
          filter={{
            nodes: flow.ui.nodes,
            groups: ['default'],
            attributes: ['hidden']
          }}
          includeCSRF={true}
        />
        {children}
      </>
    </form>
  );
};
