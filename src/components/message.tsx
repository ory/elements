import React from "react";
import {messageStyle, MessageVariants} from "../theme";

export type MessageProps = {
  children?: React.ReactNode;
  message: string;
} & MessageVariants

export const Message = ({children, message, severity}: MessageProps) => {
  return (
    <div className={messageStyle({severity: severity})}>
      <div>{message}</div>
      {children}
    </div>
  )
}
