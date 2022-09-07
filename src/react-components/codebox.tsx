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
  return (
    <div
      className={cn(className, gridStyle({ gap: 16 }), codeboxStyle)}
      {...props}
    >
      <div
        className={cn(typographyStyle({ size: "small" }), codeboxHeaderStyle)}
      >
        <div>Hide contents</div>
        <input id="collapse-code" type="checkbox" />
        <label htmlFor="collapse-code">
          <i
            className={cn(
              "fa fa-caret-down",
              colorSprinkle({ color: "accentDefault" }),
            )}
          />
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
