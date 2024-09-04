// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  FormEventHandler,
  MouseEventHandler,
} from "react"
import { OryCardComponents } from "./components"
import { OryFormComponents } from "./components/form/form"

export type HeadlessButtonProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
} & Omit<ComponentPropsWithoutRef<"button">, "children">

export type HeadlessLinkButtonProps = {
  attributes: UiNodeAnchorAttributes
  node: UiNode
} & Omit<ComponentPropsWithoutRef<"a">, "children">

export type HeadlessLabelProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
} & ComponentPropsWithoutRef<"label">

export type HeadlessTextProps = {
  attributes: UiNodeTextAttributes
  node: UiNode
}

export type HeadlessAuthMethodListItemProps = {
  setGroups: Dispatch<React.SetStateAction<string[]>>
  setStep: Dispatch<React.SetStateAction<number>>
  group: string
}

export type HeadlessImageProps = {
  attributes: UiNodeImageAttributes
  node: UiNode
}

export type FormValues = Record<string, string | boolean | number | undefined>

export type HeadlessFormProps = ComponentPropsWithoutRef<"form"> & {
  onSubmit: FormEventHandler<HTMLFormElement>
}

export type HeadlessInputProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  onClick?: MouseEventHandler
}

export type OryFlowComponents = OryFormComponents & OryCardComponents
