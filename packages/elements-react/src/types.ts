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
import {
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "./util/utilFixSDKTypesHelper"

export type OryNodeButtonButtonProps = {
  type: "button" | "submit" | "reset"
  name: string
  value: string | number | readonly string[] | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (event: any) => void
  disabled?: boolean
}

export type OryNodeButtonProps = {
  /** @deprecated Use node.attributes instead. */
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  /**
   * Indicates whether the form is currently being submitted via this button.
   */
  isSubmitting: boolean

  buttonProps: OryNodeButtonButtonProps
}

/**
 * Props for the OryNodeSsoButton component.
 */
export type OryNodeSsoButtonProps = {
  node: UiNodeInput
  /** @deprecated Use node.attributes instead. */
  attributes: UiNodeInputAttributes
  provider: string
  isSubmitting: boolean
  buttonProps: OryNodeButtonButtonProps
}

export type OryNodeAnchorProps = {
  attributes: UiNodeAnchorAttributes
  node: UiNode
} & Omit<ComponentPropsWithoutRef<"a">, "children">

export type OryNodeLabelProps = {
  /** @deprecated Use node.attributes instead. */
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  fieldError?: object
} & PropsWithChildren

export type OryNodeTextProps = {
  node: UiNodeText
  /**
   * @deprecated Use node.attributes instead.
   */
  attributes: UiNodeTextAttributes
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
  disabled?: boolean
}

export type OryNodeImageProps = {
  /** @deprecated Use node.attributes instead. */
  attributes: UiNodeImageAttributes
  node: UiNodeImage
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

export type OryNodeCheckboxInputProps = {
  name: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onChange: (event: any) => void
  disabled?: boolean
  type: "checkbox"
  checked: boolean
  value: string | number | readonly string[] | undefined
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ref: (instance: any) => void
}

export type OryNodeCheckboxProps = {
  /** @deprecated - use node.attributes */
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  /** @deprecated - use inputProps.onClick */
  onClick: MouseEventHandler
  inputProps: OryNodeCheckboxInputProps
}

export type OryNodeInputInputProps = {
  name: string
  value: string | number | readonly string[] | undefined
  onClick: MouseEventHandler
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  onChange: (event: any) => void

  onBlur: () => void
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  ref: (instance: any) => void
  disabled?: boolean
  type: string
  autoComplete?: string
  maxLength?: number
  placeholder: string
}

export type OryNodeInputProps = {
  /** @deprecated - use node.attributes */
  attributes: UiNodeInputAttributes
  node: UiNodeInput
  /** @deprecated - use inputProps.onClick */
  onClick?: MouseEventHandler
  inputProps: OryNodeInputInputProps
}

export type OryNodeConsentScopeCheckboxProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  onCheckedChange: (checked: boolean) => void
  inputProps: {
    name: string
    disabled?: boolean
    checked: boolean
    value: string
  }
}

export type OryFormSectionContentProps = PropsWithChildren<{
  title?: string
  description?: string
}>

export type OryFormSectionFooterProps = PropsWithChildren<{
  text?: string
}>
