import ReactDOMServer from 'react-dom/server';
import {Card, CardProps} from "./card";

export const CardServer = ({children, title, theme}: CardProps) => {
  return ReactDOMServer.renderToStaticMarkup(Card({children, title, theme}));
}
