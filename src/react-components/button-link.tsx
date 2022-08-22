import React from 'react';
import { typographyStyle } from '../theme';
import cn from 'classnames';
import { buttonLinkIconStyle, buttonLinkStyle } from '../theme/button-link.css';

// we use the fontawesome checkmark instead of the standard checkmark
// so we need fontawesome to be loaded
import '../assets/fontawesome.min.css';
import '../assets/fa-solid.min.css';

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string | undefined;
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export const ButtonLink = ({
  href,
  className,
  icon,
  children,
  ...props
}: ButtonLinkProps): JSX.Element => {
  return (
    <div
      className={cn(
        className,
        typographyStyle({ size: 'caption', type: 'regular' })
      )}
    >
      <a className={buttonLinkStyle()} href={href} {...props}>
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  );
};
