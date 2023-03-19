import cn from "classnames"
import { MouseEvent } from "react"

import { typographyStyle } from "../theme"
import {
  buttonLinkContainerStyle,
  ButtonLinkContainerStyle,
  buttonLinkIconStyle,
  buttonLinkStyle,
} from "../theme/button-link.css"

export type HrefWithHandler = [url: string, handler: (url: string) => void]
export type Href = string | HrefWithHandler

export type ButtonLinkProps = {
  children?: React.ReactNode
  href?: Href | undefined
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
  let handleClick

  if (Array.isArray(href)) {
    const [realHref, handler] = href
    href = realHref
    handleClick = (event: MouseEvent) => {
      event.preventDefault()
      handler(realHref)
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
      <a
        className={buttonLinkStyle()}
        href={href}
        onClick={handleClick}
        {...props}
      >
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  )
}
