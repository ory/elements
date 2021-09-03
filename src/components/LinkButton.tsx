import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { linkButtonStyles, LinkButtonStyles } from '../theme';
import cn from 'classnames';

export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    LinkButtonStyles {
  helper?: ReactNode;
  children: string;
}

const LinkButton = ({ helper, className, ...props }: LinkButtonProps) => (
  <div className={className}>
    <a
      onClick={(e) => {
        if (props.disabled) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      aria-disabled={props.disabled}
      className={cn('linkButton', { disabled: props.disabled })}
      {...props}
    />
    {helper && <span className="linkButton-helper">{helper}</span>}
  </div>
);

export default styled(LinkButton)(linkButtonStyles);
