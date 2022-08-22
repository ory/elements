import ReactDOMServer from 'react-dom/server';
import { ReactElement } from 'react';

export const ComponentWrapper = (children: ReactElement) => {
  return ReactDOMServer.renderToStaticMarkup(children);
};
