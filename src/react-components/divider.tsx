import React from "react"
import { dividerStyle } from "../theme"
import cn from "classnames"

export interface DividerProps extends React.HTMLProps<HTMLHRElement> {
  text?: string
  fullWidth?: boolean
  className?: string
}

export const Divider = ({
  className,
  fullWidth,
  text,
  ...props
}: DividerProps): JSX.Element => (
  <hr
    className={cn(
      dividerStyle(fullWidth ? { sizes: "fullWidth" } : {}),
      className,
    )}
    data-content={text}
    {...props}
  />
)
