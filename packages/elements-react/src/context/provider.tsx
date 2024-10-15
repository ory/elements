"use client"
import { PropsWithChildren } from "react"

import { OryFlowComponents } from "../components"
import { OryFlowContainer } from "../util/flowContainer"
import { OryComponentProvider } from "./component"
import { OryFlowProvider } from "./flow-context"
import { IntlProvider } from "./intl-context"

export type OryProviderProps = {
  components: OryFlowComponents
} & OryFlowContainer &
  PropsWithChildren

export function OryProvider({
  children,
  components: Components,
  ...oryFlowProps
}: OryProviderProps) {
  return (
    <IntlProvider
      locale={oryFlowProps.config.intl?.locale ?? "en"}
      customTranslations={oryFlowProps.config.intl?.customTranslations}
    >
      <OryFlowProvider {...oryFlowProps}>
        <OryComponentProvider components={Components}>
          {children}
        </OryComponentProvider>
      </OryFlowProvider>
    </IntlProvider>
  )
}
