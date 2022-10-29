import cn from "classnames"
import React from "react"
import {
  ColorSprinkle,
  colorSprinkle,
  TypographyStyle,
  typographyStyle,
} from "../theme"

// required since interfaces cannot extend types whose properties are not statically known
type typographyStyle = TypographyStyle & Record<string, unknown>
type colorSprinkle = ColorSprinkle & Record<string, unknown>
export interface TypographyProps
  extends Omit<React.BaseHTMLAttributes<HTMLDivElement>, "color">,
    typographyStyle,
    colorSprinkle {
  children: React.ReactNode
  className?: string
}

export const Typography = ({
  children,
  size,
  type,
  color,
  className,
  ...props
}: TypographyProps) => {
  return (
    <div
      className={cn(
        typographyStyle({ size, type }),
        colorSprinkle({ color }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
