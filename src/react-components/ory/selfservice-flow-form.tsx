import React from 'react';
import { FilterFlowNodes } from './filter-flow-nodes';
import { SelfServiceFlow } from './self-service-auth-card';

// SelfServiceFlowForm props
export interface SelfServiceFlowFormProps
  extends React.FormHTMLAttributes<HTMLFormElement> {
  flow: SelfServiceFlow;
  children: React.ReactNode;
  submitOnEnter?: boolean;
  className?: string;
}

export const SelfServiceFlowForm = ({
  flow,
  children,
  submitOnEnter,
  className
}: SelfServiceFlowFormProps): JSX.Element => (
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
          attributes: 'hidden'
        }}
        includeCSRF={true}
      />
      {children}
    </>
  </form>
);
