import ReactDOMServer from 'react-dom/server';
import {Card, CardProps} from "./card";

export const CardServer = ({children, title}: CardProps) => {
  return ReactDOMServer.renderToStaticMarkup(Card({children, title}));
}
