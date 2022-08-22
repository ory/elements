import React from 'react';
import { menuLinkIconLeftStyle, menuLinkStyle } from '../theme/menu-link.css';
import { colorSprinkle, typographyStyle } from '../theme';
import cn from 'classnames';

export interface MenuLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  iconLeft?: string;
  iconRight?: string;
  className?: string;
}

export const MenuLink = ({
  href,
  children,
  disabled,
  iconLeft,
  iconRight,
  className,
  ...props
}: MenuLinkProps): JSX.Element => (
  <div className={cn(className, menuLinkStyle)} {...props}>
    <a
      className={cn(
        typographyStyle({ size: 'small', type: 'regular' }),
        colorSprinkle({
          color: disabled ? 'foregroundDisabled' : 'foregroundMuted'
        })
      )}
      aria-disabled={disabled}
      {...(!disabled && { href: href })}
    >
      {iconLeft && (
        <i className={cn('fa', `fa-${iconLeft}`, menuLinkIconLeftStyle)}></i>
      )}
      {children}
    </a>
    {iconRight && (
      <i
        className={cn(
          `fa`,
          `fa-${iconRight}`,
          colorSprinkle({
            color: disabled ? 'foregroundDisabled' : 'foregroundMuted'
          })
        )}
      ></i>
    )}
  </div>
);
