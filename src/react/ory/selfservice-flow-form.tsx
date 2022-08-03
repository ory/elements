import React, { ReactNode } from 'react';
import { FilterFlowNodes } from './filter-flow-nodes';
import { SelfServiceFlow } from './FlowTypes';

export interface SelfServiceFlowForm
  extends React.FormHTMLAttributes<HTMLFormElement> {
  flow: SelfServiceFlow;
  children: ReactNode;
  submitOnEnter?: boolean;
  className?: string;
}

export const SelfServiceFlowForm = ({
  flow,
  children,
  submitOnEnter,
  className
}: SelfServiceFlowForm) => {
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
          groups={['default']}
          inputTypes={['hidden']}
          flow={flow}
          includeCSRF={true}
        />
        {children}
      </>
    </form>
  );
};
