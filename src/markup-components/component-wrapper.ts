import ReactDOMServer from "react-dom/server"
import { ReactElement } from "react"

export const ComponentWrapper = (children: ReactElement | null) => {
  if (!children) {
    return null
  }
  return ReactDOMServer.renderToStaticMarkup(children)
}
