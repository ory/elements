import cn from "classnames"

import { typographyStyle } from "../theme"
import {
  buttonLinkContainerStyle,
  ButtonLinkContainerStyle,
  buttonLinkIconStyle,
  buttonLinkStyle,
} from "../theme/button-link.css"

export type ButtonLinkProps = {
  children?: React.ReactNode
  href?: string | undefined
  icon?: string
  className?: string
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonLinkContainerStyle

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
        buttonLinkContainerStyle({ position }),
      )}
    >
      <a className={buttonLinkStyle()} href={href} {...props}>
        {icon && <i className={cn(`fa fa-${icon}`, buttonLinkIconStyle)}></i>}
        {children}
      </a>
    </div>
  )
}
