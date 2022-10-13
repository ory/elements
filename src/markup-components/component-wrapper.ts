import { ReactElement } from "react"
import ReactDOMServer from "react-dom/server"

export const ComponentWrapper = (children: ReactElement | null) => {
  if (!children) {
    return null
  }
  return ReactDOMServer.renderToStaticMarkup(children)
}
