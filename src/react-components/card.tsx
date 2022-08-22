import React from "react"
import { cardStyle, cardTitleStyle, gridStyle } from "../theme"
import { typographyStyle } from "../theme"
import cn from "classnames"

export interface CardProps extends React.HTMLProps<HTMLDivElement> {
  title: string
  className?: string
  children?: React.ReactNode
}

export const Card = ({
  title,
  className,
  children,
  ...props
}: CardProps): JSX.Element => (
  <div
    className={cn(
      cardStyle(),
      typographyStyle({ type: "regular", size: "small" }),
      className,
    )}
    {...props}
  >
    <div className={gridStyle({ gap: 32 })}>
      <h4 className={cardTitleStyle}>{title}</h4>
      <div>{children}</div>
    </div>
  </div>
)
