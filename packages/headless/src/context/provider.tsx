"use client"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { OryFlowComponents } from "../types"
import { OryComponentProvider } from "./component"
import { OryFlowProvider } from "./flow-context"
import {
  IntlProvider,
  IntlProviderProps,
  SupportedTranslations,
} from "./intl-context"
import { FlowContainer } from "@ory/client-helpers"

export type ProviderProps<T> = {
  components?: OryFlowComponents
} & IntlProviderProps<T> &
  FlowContainer &
  ComponentPropsWithoutRef<"div"> &
  PropsWithChildren

export function OryProvider<T extends SupportedTranslations>({
  children,
  components: Components,
  ...props
}: ProviderProps<T>) {
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
