import { NodeProps } from "./node"
import { useComponents } from "../../../context/component"
import { triggerToWindowCall } from "../../../util/ui"
import {
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { MouseEventHandler, ReactNode, useEffect, useRef } from "react"

export const NodeInput = ({
  node,
  attributes,
}: NodeProps & {
  attributes: UiNodeInputAttributes
  onClick?: MouseEventHandler
}): ReactNode => {
  const Components = useComponents()
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

  const hasRun = useRef(false)
  useEffect(
    () => {
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
  const isCurrentIdentifier =
    attrs.name == "identifier" &&
    node.group === "identifier_first" &&
    attrs.type === "hidden"

  switch (nodeType) {
    case UiNodeInputAttributesTypeEnum.Submit:
    case UiNodeInputAttributesTypeEnum.Button:
      if (isSocial) {
        return <Components.SocialButton attributes={attrs} node={node} />
      }

      return (
        <Components.Button
          attributes={attrs}
          node={node}
          onClick={handleClick}
        />
      )
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error("Not implemented")
    case UiNodeInputAttributesTypeEnum.Checkbox:
      return (
        <Components.Checkbox
          attributes={attrs}
          node={node}
          onClick={handleClick}
        />
      )
    case UiNodeInputAttributesTypeEnum.Hidden:
      return (
        <>
          {isCurrentIdentifier && (
            <Components.CurrentIdentifierButton
              attributes={attrs}
              node={node}
            />
          )}
          <Components.Input
            attributes={attrs}
            node={node}
            onClick={handleClick}
          />
        </>
      )
    default:
      if (isPinCodeInput) {
        return (
          <Components.Label attributes={attrs} node={node}>
            <Components.PinCodeInput
              attributes={attrs}
              node={node}
              onClick={handleClick}
            />
          </Components.Label>
        )
      }

      return (
        <Components.Label attributes={attrs} node={node}>
          <Components.Input
            attributes={attrs}
            node={node}
            onClick={handleClick}
          />
        </Components.Label>
      )
  }
}
