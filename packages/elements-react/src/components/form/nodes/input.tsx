// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"
import { ReactNode, useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"
import { triggerToWindowCall } from "../../../util/ui"
import { UiNodeInput } from "../../../util/utilFixSDKTypesHelper"
import { ConsentCheckboxRenderer } from "./renderer/consent-checkbox-renderer"
import { NodeButton } from "./node-button"
import { CheckboxRenderer } from "./renderer/checkbox-renderer"
import { HiddenInputRenderer } from "./renderer/hidden-input-renderer"
import { InputRenderer } from "./renderer/input-renderer"

export const NodeInput = ({
  node,
  attributes,
}: {
  node: UiNodeInput
  attributes: UiNodeInputAttributes
}): ReactNode => {
  const { setValue } = useFormContext()

  const {
    onloadTrigger,
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
    if (
      attrs.value &&
      !(
        isResendNode ||
        isScreenSelectionNode ||
        node.group === UiNodeGroupEnum.Oauth2Consent
      )
    ) {
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

  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Submit:
    case UiNodeInputAttributesTypeEnum.Button: {
      return <NodeButton node={node} />
    }
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error("Not implemented")
    case UiNodeInputAttributesTypeEnum.Checkbox:
      if (
        node.group === "oauth2_consent" &&
        node.attributes.node_type === "input"
      ) {
        switch (node.attributes.name) {
          case "grant_scope":
            return <ConsentCheckboxRenderer node={node} />
          default:
            return null
        }
      }
      return <CheckboxRenderer node={node} />
    case UiNodeInputAttributesTypeEnum.Hidden:
      return <HiddenInputRenderer node={node} />
    default:
      return <InputRenderer node={node} />
  }
}
