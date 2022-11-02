import cn from "classnames"
import React from "react"
import { typographyStyle } from "../theme"
import { buttonLinkIconStyle, buttonLinkStyle } from "../theme/button-link.css"

// we use the fontawesome checkmark instead of the standard checkmark
// so we need fontawesome to be loaded
import "../assets/fa-solid.min.css"
import "../assets/fontawesome.min.css"

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode
  href?: string | undefined
  icon?: string
  className?: string
  position?: "left" | "right" | "center"
}

export const ButtonLink = ({
  href,
  className,
  icon,
  children,
  position,
  ...props
}: ButtonLinkProps): JSX.Element => {
  return (
    <div
      className={cn(
        className,
        typographyStyle({ size: "caption", type: "regular" }),
      )}
      style={{
        display: "inline-flex",
        width: "100%",
        justifyContent: position,
      }}
    >
      <a className={buttonLinkStyle()} href={href} {...props}>
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  )
}
