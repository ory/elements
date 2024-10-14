// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { JSX } from "react"

import { ButtonStyle, buttonStyle } from "../theme/button.css"

// required since interfaces cannot extend types whose properties are not statically known
type buttonStyle = ButtonStyle & Record<string, unknown>

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonStyle {
  header: string
  fullWidth?: boolean
  className?: string
}

export const Button = ({
  header: title,
  size,
  variant,
  fullWidth,
  className,
  ...props
}: ButtonProps): JSX.Element => (
  <div className={className}>
    <button
      className={buttonStyle({ size, variant })}
      style={{ width: fullWidth ? "100%" : "auto" }}
      {...props}
    >
      {title}
    </button>
  </div>
)
