// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NodeProps } from "./node"
import { useComponents } from "../../../context"
import { triggerToWindowCall } from "../../../util/ui"
import {
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"

export const NodeInput = ({
  node,
  attributes,
}: NodeProps & {
  attributes: UiNodeInputAttributes
  onClick?: MouseEventHandler
}): ReactNode => {
  const { Node } = useComponents()
  const { setValue } = useFormContext()

  const nodeType = attributes.type
  const {
    onloadTrigger: onloadTrigger,
    onclickTrigger,
    // These properties do not exist on input fields so we remove them (as we already have handled them).
    onclick: _ignoredOnclick,
    onload: _ignoredOnload,
    //
    ...attrs
  } = attributes

  const setFormValue = () => {
    if (attrs.value) {
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
    node.group === "oidc"
  const isPinCodeInput =
    (attrs.name === "code" && node.group === "code") ||
    (attrs.name === "totp_code" && node.group === "totp")
  const isResend = node.meta.label?.id === 1070008

  switch (nodeType) {
    case UiNodeInputAttributesTypeEnum.Submit:
    case UiNodeInputAttributesTypeEnum.Button:
      if (isSocial) {
        return <Node.OidcButton attributes={attrs} node={node} />
      }
      if (isResend) {
        return null
      }

      return (
        <Node.Button attributes={attrs} node={node} onClick={handleClick} />
      )
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error("Not implemented")
    case UiNodeInputAttributesTypeEnum.Checkbox:
      return (
        <Node.Checkbox attributes={attrs} node={node} onClick={handleClick} />
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
