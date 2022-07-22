import React from "react";
import {MessageBase, MessageProps} from "./message.base";

export const Message = ({children, message, severity}: MessageProps) => {
  return React.createElement(MessageBase({message, children, severity}));
}
