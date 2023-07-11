import cn from "classnames"

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
}

export const CodeBox = ({
  children,
  className,
  ...props
}: CodeBoxProps): JSX.Element => {
  const id = useIdWithFallback()
  return (
    <div
      className={cn(className, gridStyle({ gap: 16 }), codeboxStyle)}
      {...props}
    >
      <input id={id} type="checkbox" />
      <div
        className={cn(typographyStyle({ size: "small" }), codeboxHeaderStyle)}
      >
        <div>Toggle content</div>

        <label htmlFor={id}>
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
