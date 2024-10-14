// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"

import {
  colorSprinkle,
  gridStyle,
  navMainSectionStyle,
  navMenuLinkSelectedStyle,
  navMenuSectionStyle,
  navSectionBottom,
  navSectionTitleStyle,
  navStyle,
  typographyStyle,
} from "../theme"
import { MenuLink, MenuLinkProps } from "./menu-link"
import { useIdWithFallback } from "../common/useIdWithFallback"

export type NavSectionLinks = {
  name: string
  testId?: string
  selected?: boolean
} & Omit<MenuLinkProps, "children">

export interface NavSection {
  title?: string
  titleIcon?: string
  floatBottom?: boolean
  links: NavSectionLinks[]
}

export interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  navTitle?: string
  navSections: NavSection[]
  className?: string
}

export const Nav = ({
  navTitle,
  navSections,
  className,
  ...props
}: NavProps) => {
  const collapseNavId = `collapse-ory-elements-nav-${useIdWithFallback()}`

  return (
    <nav role="navigation" className={cn(navStyle, className)} {...props}>
      <input id={collapseNavId} type="checkbox" />
      <div
        className={cn(
          navSectionTitleStyle,
          typographyStyle({ size: "caption" }),
          colorSprinkle({ color: "accentDefault" }),
        )}
      >
        {navTitle}
        <label htmlFor={collapseNavId}>
          <i className={cn("fa", "fa-bars")}></i>
          <i className={cn("fa", "fa-xmark")}></i>
        </label>
      </div>
      <ul
        className={cn(
          navMainSectionStyle,
          navMenuSectionStyle,
          gridStyle({ gap: 24 }),
        )}
      >
        {navSections.map((section, key) => (
          <li
            key={key}
            {...(section.floatBottom && { className: navSectionBottom })}
          >
            {section.title && (
              <div
                className={cn(
                  typographyStyle({ size: "xsmall", type: "bold" }),
                  colorSprinkle({ color: "foregroundDefault" }),
                  navSectionTitleStyle,
                )}
              >
                {section.title}
                <i className={`fa fa-${section.titleIcon}`}></i>
              </div>
            )}
            <ul className={navMenuSectionStyle}>
              {section.links.map(({ testId, ...link }, key) => (
                <li
                  key={key}
                  {...(link.selected && {
                    className: navMenuLinkSelectedStyle,
                  })}
                >
                  <MenuLink data-testid={testId} {...link}>
                    {link.name}
                  </MenuLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
