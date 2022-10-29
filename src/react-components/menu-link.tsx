import cn from "classnames"
import React from "react"
import { colorSprinkle, typographyStyle } from "../theme"
import {
  menuLinkIconLeftStyle,
  menuLinkStyle,
  menuLinkTextStyle,
} from "../theme/menu-link.css"

export interface MenuLinkProps extends React.HTMLAttributes<HTMLDivElement> {
  href: string
  children: React.ReactNode
  target?: string
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
  className?: string
}

export const MenuLink = ({
  href,
  children,
  target,
  disabled,
  iconLeft,
  iconRight,
  className,
  ...props
}: MenuLinkProps): JSX.Element => (
  <div className={cn(className, menuLinkStyle)} {...props}>
    <a
      className={cn(
        typographyStyle({ size: "small", type: "regular" }),
        colorSprinkle({
          color: disabled ? "foregroundDisabled" : "foregroundMuted",
        }),
        menuLinkTextStyle,
      )}
      aria-disabled={disabled}
      {...(!disabled && { href: href })}
      {...(target && { target: target })}
    >
      {iconLeft && (
        <i className={cn("fa", `fa-${iconLeft}`, menuLinkIconLeftStyle)}></i>
      )}
      {children}
    </a>
    {iconRight && (
      <i
        className={cn(
          `fa`,
          `fa-${iconRight}`,
          colorSprinkle({
            color: disabled ? "foregroundDisabled" : "foregroundMuted",
          }),
        )}
      ></i>
    )}
  </div>
)
