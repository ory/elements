// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { ReactNode, JSX, HTMLAttributes } from "react"

import { colorSprinkle, gridStyle, typographyStyle } from "../theme"
import {
  cardContainer,
  cardGradientActionStyle,
  cardGradientOverlayStyle,
} from "../theme/card-gradient.css"

export interface CardGradientProps extends HTMLAttributes<HTMLAnchorElement> {
  heading: string | ReactNode
  content: string | undefined
  action: string
  target?: string
  disabled?: boolean
  className?: string
  children?: ReactNode
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
