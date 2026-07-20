// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import type { Slot } from "vue"

// Fixed SDK types for better type narrowing
export type UiNodeInput = UiNode & {
  type: "input"
  attributes: UiNodeInputAttributes
}

export type UiNodeImage = UiNode & {
  type: "img"
  attributes: UiNodeImageAttributes
}

export type UiNodeText = UiNode & {
  type: "text"
  attributes: UiNodeTextAttributes
}

export type UiNodeAnchor = UiNode & {
  type: "a"
  attributes: UiNodeAnchorAttributes
}

export function isUiNodeInput(node: UiNode): node is UiNodeInput {
  return node.type === "input"
}

export function isUiNodeImage(node: UiNode): node is UiNodeImage {
  return node.type === "img"
}

export function isUiNodeText(node: UiNode): node is UiNodeText {
  return node.type === "text"
}

export function isUiNodeAnchor(node: UiNode): node is UiNodeAnchor {
  return node.type === "a"
}

export type OryNodeButtonProps = {
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  isSubmitting: boolean
  onClick: (event: Event) => void
}

export type OryNodeSsoButtonProps = {
  node: UiNodeInput
  attributes: UiNodeInputAttributes
  provider: string
  isSubmitting: boolean
  onClick: (event: Event) => void
}

export type OryNodeAnchorProps = {
  attributes: UiNodeAnchorAttributes
  node: UiNode
}

export type OryNodeLabelProps = {
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  fieldError?: object
}

export type OryNodeTextProps = {
  node: UiNodeText
  attributes: UiNodeTextAttributes
}

export type OryCardLogoProps = {
  logoUrl?: string
}

export type OryNodeCaptchaProps = {
  node: UiNode
}

export type OryFormGroupProps = {
  default?: Slot
}

export type OryCardAuthMethodListItemProps = {
  onClick: () => void
  group: string
  title?: { id: string; values?: Record<string, string> }
  disabled?: boolean
}

export type OryNodeImageProps = {
  attributes: UiNodeImageAttributes
  node: UiNodeImage
}

export type FormValues = Record<
  string,
  string | boolean | number | string[] | undefined
>

export type OryFormRootProps = {
  onSubmit: (event: Event) => void
}

export type OryNodeCheckboxProps = {
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  modelValue: boolean
  onChange: (checked: boolean) => void
}

export type OryNodeInputProps = {
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  modelValue: string | number | undefined
  onChange: (value: string | number) => void
  onBlur: () => void
}

export type OryNodeConsentScopeCheckboxProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  modelValue: boolean
  onChange: (checked: boolean) => void
}

export type OryFormSectionContentProps = {
  title?: string
  description?: string
}

export type OryFormSectionFooterProps = {
  text?: string
}
