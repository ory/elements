import {messageStyle, MessageVariants} from "../theme/message.css";
import {Children} from "./types";

export type MessageProps = {
  children?: Children;
  message: string;
} & MessageVariants

export const MessageBase = ({message, children, severity}: MessageProps) => {
  return `
  <div class=${messageStyle({severity: severity})}>
    <caption>${message}</caption>
    ${children}
  </div>
  `
}
