import cn from "classnames"
import React from "react"
import { colorSprinkle, gridStyle, typographyStyle } from "../theme"
import {
  cardContainer,
  cardGradientActionStyle,
  cardGradientOverlayStyle,
} from "../theme/card-gradient.css"

export interface CardGradientProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  heading: string | React.ReactNode
  content: string | React.ReactNode
  action: string
  target?: string
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const CardGradient = ({
  heading,
  content,
  action,
  target,
  disabled,
  className,
  ...props
}: CardGradientProps): JSX.Element => (
  <a
    className={cn(cardContainer, cardGradientOverlayStyle({ disabled }))}
    target={target}
    aria-disabled={disabled}
    {...(!disabled && { href: action })}
    {...props}
  >
    <div
      className={cn(
        colorSprinkle({
          color: disabled ? "foregroundOnDisabled" : "foregroundOnDark",
        }),
        className,
      )}
    >
      <div className={cn(gridStyle({ gap: 16 }))}>
        {typeof heading === "string" ? (
          <div
            className={typographyStyle({ size: "headline21", type: "bold" })}
          >
            {heading}
          </div>
        ) : (
          heading
        )}
        {typeof content === "string" ? (
          <div className={typographyStyle({ size: "small", type: "regular" })}>
            {content}
          </div>
        ) : (
          content
        )}
      </div>
    </div>
    <i
      className={cn(`fa fa-arrow-right`, cardGradientActionStyle({ disabled }))}
    ></i>
  </a>
)
