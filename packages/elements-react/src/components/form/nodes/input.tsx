// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { useComponents } from "../../../context"
import { triggerToWindowCall } from "../../../util/ui"
import { NodeProps } from "./node"

export const NodeInput = ({
  node,
  attributes,
}: NodeProps & {
  attributes: UiNodeInputAttributes
  onClick?: MouseEventHandler
}): ReactNode => {
  const { Node } = useComponents()
  const { setValue, register, watch } = useFormContext()

  const {
    onloadTrigger: onloadTrigger,
    onclickTrigger,
    // These properties do not exist on input fields so we remove them (as we already have handled them).
    onclick: _ignoredOnclick,
    onload: _ignoredOnload,
    //
    ...attrs
  } = attributes
  const isResendNode = node.meta.label?.id === 1070008
  const isScreenSelectionNode =
    "name" in node.attributes && node.attributes.name === "screen"

  const setFormValue = () => {
    if (isResendNode || isScreenSelectionNode || node.group === "consent") {
      return
    }
    if (attrs.value !== undefined) {
      setValue(attrs.name, attrs.value)
    }
  }

  const hasRun = useRef(false)
  useEffect(
    () => {
      setFormValue()
      if (!hasRun.current && onloadTrigger) {
        hasRun.current = true
        triggerToWindowCall(onloadTrigger)
      }
    },
    // TODO(jonas): make sure onloadTrigger is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ignore onloadTrigger for now, until we make sure this is stable
    [],
  )

  const handleClick: MouseEventHandler = () => {
    setFormValue()
    if (onclickTrigger) {
      triggerToWindowCall(onclickTrigger)
    }
  }

  const isSocial =
    (attrs.name === "provider" || attrs.name === "link") &&
    (node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)
  const isPinCodeInput =
    (attrs.name === "code" && node.group === "code") ||
    (attrs.name === "totp_code" && node.group === "totp")

  const handleScopeChange = (checked: boolean) => {
    const scopes = watch("grant_scope")
    if (Array.isArray(scopes)) {
      if (checked) {
        setValue("grant_scope", Array.from(new Set([...scopes, attrs.value])))
      } else {
        setValue(
          "grant_scope",
          scopes.filter((scope: string) => scope !== attrs.value),
        )
      }
    }
  }

  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Submit:
    case UiNodeInputAttributesTypeEnum.Button:
      if (isSocial) {
        return null
      }
      if (isResendNode || isScreenSelectionNode) {
        return null
      }

      return (
        <Node.Label
          // The label is rendered in the button component
          attributes={{ ...attrs, label: undefined }}
          node={{ ...node, meta: { ...node.meta, label: undefined } }}
        >
          <Node.Button attributes={attrs} node={node} onClick={handleClick} />
        </Node.Label>
      )
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error("Not implemented")
    case UiNodeInputAttributesTypeEnum.Checkbox:
      if (node.group === "consent") {
        return (
          <Node.ConsentScopeCheckbox
            attributes={attrs}
            node={node}
            onCheckedChange={handleScopeChange}
          />
        )
      }
      return (
        <Node.Label
          // The label is rendered in the checkbox component
          attributes={{ ...attrs, label: undefined }}
          node={{ ...node, meta: { ...node.meta, label: undefined } }}
        >
          <Node.Checkbox attributes={attrs} node={node} onClick={handleClick} />
        </Node.Label>
      )
    case UiNodeInputAttributesTypeEnum.Hidden:
      return <Node.Input attributes={attrs} node={node} onClick={handleClick} />
    default:
      if (isPinCodeInput) {
        return (
          <Node.Label attributes={attrs} node={node}>
            <Node.CodeInput
              attributes={attrs}
              node={node}
              onClick={handleClick}
            />
          </Node.Label>
        )
      }

      return (
        <Node.Label attributes={attrs} node={node}>
          <Node.Input attributes={attrs} node={node} onClick={handleClick} />
        </Node.Label>
      )
  }
}
