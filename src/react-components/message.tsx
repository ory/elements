import cn from "classnames"
import React from "react"
import { MessageStyle, messageStyle, typographyStyle } from "../theme"

// required since interfaces cannot extend types whose properties are not statically known
export type MessageStyleProps = MessageStyle & Record<string, unknown>

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    MessageStyleProps {
  className?: string
  children?: React.ReactNode
}

export const Message = ({
  severity,
  textPosition,
  className,
  children,
  ...props
}: MessageProps): JSX.Element => (
  <div
    className={cn(
      messageStyle({ severity, textPosition }),
      typographyStyle({ size: "caption", type: "regular" }),
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
