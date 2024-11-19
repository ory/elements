// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent } from "react"
import ReactDOMServer from "react-dom/server"
import {
  CustomTranslations,
  IntlProvider,
  SupportedTranslations,
} from "../react-components"

export type Context = SupportedTranslations | CustomTranslations

export const ComponentWrapper = <Props extends {}>(
  Component: FunctionComponent<Props>,
  props: Props,
  ctx: Context,
) => {
  return ReactDOMServer.renderToStaticMarkup(
    <IntlProvider<typeof ctx> {...ctx}>
      <Component {...props} />
    </IntlProvider>,
  )
}
