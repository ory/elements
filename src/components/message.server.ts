import {Message, MessageProps} from "./message";
import ReactDOMServer from "react-dom/server";

export const MessageServer = ({children, message, severity}: MessageProps) => {
  return ReactDOMServer.renderToStaticMarkup(Message({children, message, severity}));
}
