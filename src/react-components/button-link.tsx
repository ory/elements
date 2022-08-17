import React from 'react';
import { typographyStyle } from '../theme';
import cn from 'classnames';
import { buttonLinkIconStyle, buttonLinkStyle } from '../theme/button-link.css';
import { ButtonLinkProps } from '../component-types';

// we use the fontawesome checkmark instead of the standard checkmark
// so we need fontawesome to be loaded
import '../../public/fontawesome.min.css';
import '../../public/fa-solid.min.css';

export const ButtonLink = ({
  href,
  className,
  icon,
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
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  );
};
