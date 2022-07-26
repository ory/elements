import React from "react";
import {messageStyle, MessageVariants} from "../theme";

export type MessageProps = {
  message: string;
  className?: string;
  children?: React.ReactNode;
} & MessageVariants

export const Message = ({message, severity, className, children}: MessageProps) => {
  return (
    <div className={`${messageStyle({severity: severity})} ${className ? className : ''}`}>
      <div>{message}</div>
      {children}
    </div>
  )
}
