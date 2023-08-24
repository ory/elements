// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent } from "react"
import ReactDOMServer from "react-dom/server"
import { IntlProvider } from "react-intl"
import * as locales from "../locales"

export type Context = {
  locale?: keyof typeof locales
}

export const ComponentWrapper = <Props extends {}>(
  Component: FunctionComponent<Props>,
  props: Props,
  { locale = "en" }: Context,
) => {
  return ReactDOMServer.renderToStaticMarkup(
    <IntlProvider
      locale={locale}
      defaultLocale="en"
      messages={locales[locale]}
      defaultRichTextElements={{
        del: (chunks) => <del>{chunks}</del>,
      }}
    >
      <Component {...props} />
    </IntlProvider>,
  )
}
