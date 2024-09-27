// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { PropsWithChildren } from "react"

import { OryFlowComponents } from "../components"
import { OryFlowContainer } from "../util/flowContainer"
import { OryComponentProvider } from "./component"
import { OryFlowProvider } from "./flow-context"
import {
  IntlProvider,
  OryIntlProviderProps,
  SupportedTranslations,
} from "./intl-context"

export type OryProviderProps<T> = {
  components: OryFlowComponents
} & OryIntlProviderProps<T> &
  OryFlowContainer &
  PropsWithChildren

export function OryProvider<Translation extends SupportedTranslations>({
  children,
  components: Components,
  ...props
}: OryProviderProps<Translation>) {
  const { locale, defaultLocale, ...oryFlowProps } = props

  return (
    <IntlProvider locale={locale ?? "en"} defaultLocale={defaultLocale ?? "en"}>
      <OryFlowProvider {...oryFlowProps}>
        <OryComponentProvider components={Components}>
          {children}
        </OryComponentProvider>
      </OryFlowProvider>
    </IntlProvider>
  )
}
