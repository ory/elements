// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { JSX } from "react"

import { dividerStyle, dividerTextStyle } from "../theme"

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
}: DividerProps): JSX.Element =>
  text ? (
    <div className={cn(dividerTextStyle, className)} {...props}>
      {text}
    </div>
  ) : (
    <hr
      className={cn(
        dividerStyle(fullWidth ? { sizes: "fullWidth" } : {}),
        className,
      )}
      {...props}
    />
  )
