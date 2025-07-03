// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import {
  ComponentPropsWithoutRef,
  FormEventHandler,
  MouseEventHandler,
  PropsWithChildren,
} from "react"
import { ButtonVariants } from "./theme/default/components/form/button"

export type OryNodeButtonProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
} & Omit<ComponentPropsWithoutRef<"button">, "children"> &
  ButtonVariants

export type OryNodeAnchorProps = {
  attributes: UiNodeAnchorAttributes
  node: UiNode
} & Omit<ComponentPropsWithoutRef<"a">, "children">

export type OryNodeLabelProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
} & ComponentPropsWithoutRef<"label">

export type OryNodeTextProps = {
  attributes: UiNodeTextAttributes
  node: UiNode
}

export type OryCardLogoProps = Record<string, never>

export type OryNodeCaptchaProps = {
  node: UiNode
}

/**
 * Props for the Form.Group component.
 */
export type OryFormGroupProps = PropsWithChildren

/**
 * Props for the AuthMethodListItem component. This component is used
 * to render a single auth method in the AuthMethodList component.
 */
export type OryCardAuthMethodListItemProps = {
  onClick: () => void
  group: string
  title?: { id: string; values?: Record<string, string> }
}

export type OryNodeImageProps = {
  attributes: UiNodeImageAttributes
  node: UiNode
}

/**
 * A generic type for the form values.
 */
export type FormValues = Record<string, string | boolean | number | undefined>

/**
 * Props for the Form.Root component.
 */
export type OryFormRootProps = ComponentPropsWithoutRef<"form"> & {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export type OryNodeInputProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  onClick?: MouseEventHandler
}

export type OryNodeConsentScopeCheckboxProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  onCheckedChange: (checked: boolean) => void
}

export type OryFormSectionContentProps = PropsWithChildren<{
  title?: string
  description?: string
}>

export type OryFormSectionFooterProps = PropsWithChildren<{
  text?: string
}>
