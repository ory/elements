// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { JSX } from "react"

import {
  codeboxContentStyle,
  codeboxHeaderStyle,
  codeboxStyle,
  colorSprinkle,
  gridStyle,
  typographyStyle,
} from "../theme"
import { useIdWithFallback } from "../common/useIdWithFallback"

export interface CodeBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  toggleText?: string
}

export const CodeBox = ({
  children,
  className,
  toggleText,
  ...props
}: CodeBoxProps): JSX.Element => {
  const id = useIdWithFallback()
  return (
    <div
      className={cn(className, gridStyle({ gap: 16 }), codeboxStyle)}
      {...props}
    >
      <input id={id} type="checkbox" />
      <label
        htmlFor={id}
        className={cn(typographyStyle({ size: "small" }), codeboxHeaderStyle)}
      >
        <div>{toggleText ?? "Toggle content"}</div>

        <span>
          <i
            className={cn(
              "fa fa-caret-down",
              colorSprinkle({ color: "accentDefault" }),
            )}
          ></i>
          <i
            className={cn(
              "fa fa-caret-up",
              colorSprinkle({ color: "accentDefault" }),
            )}
          ></i>
        </span>
      </label>
      <pre
        className={cn(
          colorSprinkle({ color: "accentEmphasis" }),
          codeboxContentStyle,
        )}
      >
        {children}
      </pre>
    </div>
  )
}
