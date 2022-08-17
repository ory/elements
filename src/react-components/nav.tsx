import React from 'react';
import { colorSprinkle, typographyStyle } from '../theme';
import { navSectionTitleStyle, navStyle } from '../theme/nav.css';
import { MenuLink } from './menu-link';
import cn from 'classnames';

type NavSectionLinks = {
  name: string;
  url: string;
  iconLeft: string;
  iconRight?: string;
  disabled?: boolean;
};

type NavSection = {
  title?: string;
  titleIcon?: string;
  links: NavSectionLinks[];
};

export interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  navTitle: string;
  navSections: NavSection[];
  className?: string;
}

export const Nav = ({ navTitle, navSections, className }: NavProps) => {
  return (
    <nav className={cn(navStyle, className)}>
      <div
        className={cn(
          navSectionTitleStyle,
          typographyStyle({ size: 'caption' }),
          colorSprinkle({ color: 'accentDefault' })
        )}
      >
        {navTitle}
      </div>

      {navSections.map((section) => (
        <div>
          {section.title && (
            <div
              className={cn(
                typographyStyle({ size: 'xsmall', type: 'bold' }),
                colorSprinkle({ color: 'foregroundDefault' }),
                navSectionTitleStyle
              )}
            >
              {section.title}
              <i className={`fa fa-${section.titleIcon}`}></i>
            </div>
          )}
          {section.links.map((link) => (
            <MenuLink
              href={link.url}
              iconLeft={link.iconLeft}
              iconRight={link.iconRight}
              disabled={link.disabled}
            >
              {link.name}
            </MenuLink>
          ))}
        </div>
      ))}
    </nav>
  );
};
