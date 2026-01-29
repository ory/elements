// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import { inject, provide, type InjectionKey, type Component } from "vue"

/**
 * Component types for Ory flows
 */
export type OryFlowComponents = {
  Node: {
    Button: Component
    SsoButton: Component
    Anchor: Component
    Input: Component
    CodeInput: Component
    Image: Component
    Label: Component
    Checkbox: Component
    Text: Component
    Captcha: Component
    ConsentScopeCheckbox: Component
  }
  Card: {
    Root: Component
    Footer: Component
    Header: Component
    Content: Component
    Logo: Component
    Divider: Component
    AuthMethodListContainer: Component
    AuthMethodListItem: Component
    SettingsSection: Component
    SettingsSectionContent: Component
    SettingsSectionFooter: Component
  }
  Form: {
    Root: Component
    SsoRoot: Component
    Group: Component
    SsoSettings: Component
    WebauthnSettings: Component
    PasskeySettings: Component
    TotpSettings: Component
    RecoveryCodesSettings: Component
  }
  Message: {
    Root: Component
    Content: Component
    Toast: Component
  }
  Page: {
    Header: Component
  }
}

/**
 * Partial component overrides
 */
export type OryFlowComponentOverrides = {
  [P in keyof OryFlowComponents]?: OryFlowComponents[P] extends object
    ? { [K in keyof OryFlowComponents[P]]?: OryFlowComponents[P][K] }
    : OryFlowComponents[P]
}

type ComponentContextValue = {
  components: OryFlowComponents
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

const ComponentKey: InjectionKey<ComponentContextValue> =
  Symbol("OryComponents")

const defaultNodeOrder = [
  "oidc",
  "saml",
  "identifier_first",
  "default",
  "profile",
  "password",
  "captcha",
  "passkey",
  "code",
  "webauthn",
]

/**
 * Default node sorter function
 */
export function defaultNodeSorter(a: UiNode, b: UiNode): number {
  const aIsCaptcha = a.group === "captcha"
  const bIsCaptcha = b.group === "captcha"
  const aIsSubmit =
    isUiNodeInputAttributes(a.attributes) && a.attributes.type === "submit"
  const bIsSubmit =
    isUiNodeInputAttributes(b.attributes) && b.attributes.type === "submit"

  if (aIsCaptcha && bIsSubmit) {
    return -1
  }
  if (bIsCaptcha && aIsSubmit) {
    return 1
  }

  const aGroupWeight = defaultNodeOrder.indexOf(a.group) ?? 999
  const bGroupWeight = defaultNodeOrder.indexOf(b.group) ?? 999

  return aGroupWeight - bGroupWeight
}

const defaultGroupOrder: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Password,
  UiNodeGroupEnum.Oidc,
  UiNodeGroupEnum.Code,
  UiNodeGroupEnum.LookupSecret,
  UiNodeGroupEnum.Passkey,
  UiNodeGroupEnum.Webauthn,
  UiNodeGroupEnum.Totp,
]

/**
 * Default group sorter function
 */
export function defaultGroupSorter(
  a: UiNodeGroupEnum,
  b: UiNodeGroupEnum,
): number {
  const aGroupWeight = defaultGroupOrder.indexOf(a) ?? 999
  const bGroupWeight = defaultGroupOrder.indexOf(b) ?? 999

  return aGroupWeight - bGroupWeight
}

export type ProvideComponentsOptions = {
  components: OryFlowComponents
  nodeSorter?: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter?: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

/**
 * Provide components for Ory flows
 */
export function provideComponents({
  components,
  nodeSorter = defaultNodeSorter,
  groupSorter = defaultGroupSorter,
}: ProvideComponentsOptions) {
  const context: ComponentContextValue = {
    components,
    nodeSorter,
    groupSorter,
  }

  provide(ComponentKey, context)

  return context
}

/**
 * Use the Ory flow components
 */
export function useComponents(): OryFlowComponents {
  const ctx = inject(ComponentKey)
  if (!ctx) {
    throw new Error(
      "useComponents must be used within a component that has called provideComponents",
    )
  }
  return ctx.components
}

/**
 * Use the node sorter function
 */
export function useNodeSorter() {
  const ctx = inject(ComponentKey)
  if (!ctx) {
    throw new Error(
      "useNodeSorter must be used within a component that has called provideComponents",
    )
  }
  return ctx.nodeSorter
}

/**
 * Use the group sorter function
 */
export function useGroupSorter() {
  const ctx = inject(ComponentKey)
  if (!ctx) {
    throw new Error(
      "useGroupSorter must be used within a component that has called provideComponents",
    )
  }
  return ctx.groupSorter
}
