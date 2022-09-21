import React from "react"
import cn from "classnames"
import {
  cardGradientActionStyle,
  cardGradientStyle,
} from "../theme/card-gradient.css"
import { gridStyle, typographyStyle } from "../theme"

export interface CardGradientProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading: string | React.ReactNode
  content: string | React.ReactNode
  action: string | React.ReactNode
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const CardGradient = ({
  heading,
  content,
  action,
  disabled,
  className,
  ...props
}: CardGradientProps): JSX.Element => (
  <div
    className={cn(cardGradientStyle({ disabled: disabled }), className)}
    {...props}
  >
    <div className={gridStyle({ gap: 16 })}>
      {typeof heading === "string" ? (
        <div className={typographyStyle({ size: "headline21", type: "bold" })}>
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
    {typeof action === "string" ? (
      <a className={cardGradientActionStyle} href={action}>
        <i className={cn(`fa fa-arrow-right`)}></i>
      </a>
    ) : (
      action
    )}
  </div>
)
