import React from "react";
import { messageStyle, MessageVariants } from "../theme";
import cn from "classnames";

export type MessageProps = {
  message: string;
  className?: string;
  children?: React.ReactNode;
} & MessageVariants

export const Message = ({ message, severity, className, children }: MessageProps) => {
  return (
    <div className={cn(messageStyle({ severity: severity }), className)}>
      <div>{message}</div>
      {children}
    </div>
  )
}
