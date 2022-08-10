import React from 'react';
import { typographyStyle } from '../theme';
import cn from 'classnames';
import { buttonLinkStyle } from '../theme/button-link.css';

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
}

export const ButtonLink = ({
  href,
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  return (
    <div
      className={cn(
        className,
        typographyStyle({ size: 'caption', type: 'regular' })
      )}
    >
      <a className={buttonLinkStyle()} href={href} {...props}>
        {children}
      </a>
    </div>
  );
};
