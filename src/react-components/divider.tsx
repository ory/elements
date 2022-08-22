import React from "react"
import { dividerStyle } from "../theme"
import cn from "classnames"

export interface DividerProps extends React.HTMLProps<HTMLHRElement> {
  fullWidth?: boolean
  className?: string
}

export const Divider = ({
  className,
  fullWidth,
  ...props
}: DividerProps): JSX.Element => (
  <hr
    className={cn(
      dividerStyle(fullWidth ? { sizes: "fullWidth" } : {}),
      className,
    )}
    {...props}
  />
)
