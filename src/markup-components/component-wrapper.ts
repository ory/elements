// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from "react"
import ReactDOMServer from "react-dom/server"

export const ComponentWrapper = (children: ReactElement | null) => {
  if (!children) {
    return null
  }
  return ReactDOMServer.renderToStaticMarkup(children)
}
