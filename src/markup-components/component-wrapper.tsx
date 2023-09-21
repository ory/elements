// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, PropsWithChildren } from "react"
import ReactDOMServer from "react-dom/server"
import { IntlProvider } from "../react-components"
import * as locales from "../locales"

export interface Context {
  locale?: keyof typeof locales
}

export const ComponentWrapper = <WrapperProps extends PropsWithChildren>(
  Component: FunctionComponent<WrapperProps>,
  props: WrapperProps,
  { locale = "en" }: Context,
) => {
  return ReactDOMServer.renderToStaticMarkup(
    <IntlProvider locale={locale}>
      <Component {...props} />
    </IntlProvider>,
  )
}
