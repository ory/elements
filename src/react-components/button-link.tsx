import cn from "classnames"
import { MouseEvent, JSX } from "react"

import { typographyStyle } from "../theme"
import {
  buttonLinkContainerStyle,
  ButtonLinkContainerStyle,
  buttonLinkIconStyle,
  buttonLinkStyle,
} from "../theme/button-link.css"

export interface CustomHref {
  href: string
  handler: (url: string) => void
}

const isCustomHref = (
  href: CustomHref | string | undefined,
): href is CustomHref => {
  return href !== undefined && (href as CustomHref).href !== undefined
}

export type ButtonLinkProps = {
  children?: React.ReactNode
  href?: CustomHref | string
  icon?: string
  className?: string
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  ButtonLinkContainerStyle

export const ButtonLink = ({
  href,
  className,
  icon,
  children,
  position,
  ...props
}: ButtonLinkProps): JSX.Element => {
  let linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    ...props,
  }

  if (isCustomHref(href)) {
    linkProps = {
      ...linkProps,
      href: href.href,
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        href.handler(href.href)
      },
    }
  } else {
    linkProps = {
      ...linkProps,
      href: href,
    }
  }

  return (
    <div
      className={cn(
        className,
        typographyStyle({ size: "caption", type: "regular" }),
        buttonLinkContainerStyle({ position }),
      )}
    >
      <a className={buttonLinkStyle()} {...linkProps}>
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  )
}
