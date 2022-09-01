import React from "react"
import { MessageStyle, messageStyle, typographyStyle } from "../theme"
import cn from "classnames"

// required since interfaces cannot extend types whose properties are not statically known
type messageProps = MessageStyle & Record<string, unknown>

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    messageProps {
  className?: string
  children?: React.ReactNode
}

export const Message = ({
  severity,
  className,
  children,
  ...props
}: MessageProps): JSX.Element => (
  <div
    className={cn(
      messageStyle({ severity: severity }),
      typographyStyle({ size: "caption", type: "regular" }),
      className,
    )}
    {...props}
  >
    {children}
  </div>
)
