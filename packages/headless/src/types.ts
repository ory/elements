import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import {
  ComponentPropsWithoutRef,
  Dispatch,
  FormEvent,
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

export interface FormValues {
  [key: string]: string | boolean | number | undefined
}

export type HeadlessFormProps = ComponentPropsWithoutRef<"form"> & {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export type HeadlessInputProps = {
  attributes: UiNodeInputAttributes
  node: UiNode
  onClick: MouseEventHandler
}

export type OryFlowComponents = OryFormComponents & OryCardComponents
