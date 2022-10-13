import cn from "classnames"
import React from "react"
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

export type NavSectionLinks = {
  name: string
  testId?: string
  selected?: boolean
} & Omit<MenuLinkProps, "children">

export type NavSection = {
  title?: string
  titleIcon?: string
  floatBottom?: boolean
  links: NavSectionLinks[]
}

export interface NavProps extends React.HTMLAttributes<HTMLDivElement> {
  navTitle: string
  navSections: NavSection[]
  className?: string
}

export const Nav = ({
  navTitle,
  navSections,
  className,
  ...props
}: NavProps) => (
  <nav role="navigation" className={cn(navStyle, className)} {...props}>
    <input id="collapse-nav" type="checkbox" />
    <div
      className={cn(
        navSectionTitleStyle,
        typographyStyle({ size: "caption" }),
        colorSprinkle({ color: "accentDefault" }),
      )}
    >
      {navTitle}
      <label htmlFor="collapse-nav">
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
                {...(link.selected && { className: navMenuLinkSelectedStyle })}
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
