"use client"
import {
  IntlProvider,
  IntlProviderProps,
  SupportedTranslations,
} from "./intl-context"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { OryDefaultComponents } from "../../themes/default"
import { FlowContainer, OryFlowComponents } from "../types"
import { mergeComponents } from "../util/component-helpers"
import { OryComponentProvider } from "./component"
import { OryFlowProvider } from "./flow-context"

export type ProviderProps<T> = {
  components?: Partial<OryFlowComponents>
} & IntlProviderProps<T> &
  FlowContainer &
  ComponentPropsWithoutRef<"div"> &
  PropsWithChildren

export function OryProvider<T extends SupportedTranslations>({
  children,
  components: flowComponentOverrides,
  ...props
}: ProviderProps<T>) {
  const Components = mergeComponents(
    OryDefaultComponents,
    flowComponentOverrides,
  )

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
