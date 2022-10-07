import React from "react"
import cn from "classnames"
import {
  cardContainer,
  cardGradientActionStyle,
  cardGradientOverlayStyle,
  cardGradientStyle,
} from "../theme/card-gradient.css"
import { colorSprinkle, gridStyle, typographyStyle } from "../theme"

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
  <div className={cn(cardContainer, cardGradientOverlayStyle({ disabled }))}>
    <a
      className={cn(
        cardGradientStyle,
        colorSprinkle({
          color: disabled ? "foregroundOnDisabled" : "foregroundOnDark",
        }),
        className,
      )}
      target={target}
      aria-disabled={disabled}
      {...(!disabled && { href: action })}
      {...props}
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
    </a>
    <i
      className={cn(`fa fa-arrow-right`, cardGradientActionStyle({ disabled }))}
    ></i>
  </div>
)
