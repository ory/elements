import React from "react"
import { cardStyle, cardTitleStyle, gridStyle } from "../theme"
import { typographyStyle } from "../theme"
import cn from "classnames"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string | React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const Card = ({
  heading,
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
      {typeof heading === "string" ? (
        <h3 className={cardTitleStyle}>{heading}</h3>
      ) : (
        heading
      )}
      <div>{children}</div>
    </div>
  </div>
)
