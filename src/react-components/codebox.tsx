import React from "react"
import {
  codeboxContentStyle,
  codeboxHeaderStyle,
  codeboxStyle,
  colorSprinkle,
  gridStyle,
  typographyStyle,
} from "../theme"
import cn from "classnames"

export interface CodeBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export const CodeBox = ({
  children,
  className,
  ...props
}: CodeBoxProps): JSX.Element => {
  const id = Math.random().toString(36).substring(2)
  return (
    <div
      className={cn(className, gridStyle({ gap: 16 }), codeboxStyle)}
      {...props}
    >
      <input id={id} type="checkbox" />
      <div
        className={cn(typographyStyle({ size: "small" }), codeboxHeaderStyle)}
      >
        <div>Hide contents</div>

        <label htmlFor={id}>
          <i
            className={cn(
              "fa fa-caret-down",
              colorSprinkle({ color: "accentDefault" }),
            )}
          ></i>
        </label>
      </div>
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
