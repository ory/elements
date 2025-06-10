// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiContainer, UiNodeInputAttributes } from "@ory/client-fetch"
import { OryCardAuthMethodListItemProps, useOryFlow } from "@ory/elements-react"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { useEventListener, useTimeout } from "usehooks-ts"
import { triggerToFunction } from "../../../../util/ui"
import AlertIcon from "../../assets/icons/alert-triangle.svg"
import lookup_secret from "../../assets/icons/code-asterix.svg"
import code from "../../assets/icons/code.svg"
import {
  default as hardware_token,
  default as passkey,
} from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import totp from "../../assets/icons/totp.svg"
import webauthn from "../../assets/icons/webauthn.svg"
import logos from "../../provider-logos"
import { isGroupImmediateSubmit } from "../../utils/form"
import { ListItem } from "./list-item"
import { useFormContext } from "react-hook-form"

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
  hardware_token,
  totp,
  lookup_secret,
  ...logos,
}

export function DefaultAuthMethodListItem({
  onClick,
  group,
  title,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null
  const { flow } = useOryFlow()
  const { formState } = useFormContext()

  if (group === "passkey") {
    const passkeyNode = findPasskeyNode(flow)
    if (!passkeyNode) {
      // If the passkey node is not found, we return null
      // to avoid rendering the list item.
      // Shouldn't happen, but just in case.
      console.error("Passkey node not found")
      return null
    }

    return (
      <PasskeyListItem passkeyNode={passkeyNode} group={group} title={title} />
    )
  }

  return (
    <ListItem
      as="button"
      icon={Icon}
      title={intl.formatMessage(
        { id: title?.id ?? `two-step.${group}.title` },
        title?.values,
      )}
      description={intl.formatMessage({
        id: `two-step.${group}.description`,
      })}
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? "submit" : "button"}
      data-testid={`ory/form/auth-picker/${group}`}
      disabled={!formState.isReady}
    />
  )
}

function findPasskeyNode(flow: {
  ui: UiContainer
}): { attributes: UiNodeInputAttributes } | undefined {
  const passkeyTriggerNode = flow.ui.nodes.find(
    (node) =>
      node.attributes.node_type === "input" &&
      ["passkey_login_trigger", "passkey_register_trigger"].includes(
        node.attributes.name,
      ),
  )

  if (!passkeyTriggerNode) {
    return undefined
  }

  return passkeyTriggerNode as { attributes: UiNodeInputAttributes }
}

type PasskeyListItemProps = {
  group: string
  title?: { id: string; values?: Record<string, string> }
  passkeyNode: { attributes: UiNodeInputAttributes }
}

function PasskeyListItem({ group, title, passkeyNode }: PasskeyListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null
  const { formState } = useFormContext()

  const [isPasskeyScriptInitalized, setPasskeyScriptInitalized] =
    useState(false)
  const [failedToLoad, setFailedToLoad] = useState(false)

  const clickHandler = () => {
    if (!passkeyNode.attributes.onclickTrigger) {
      console.error("Passkey node not found")
      return
    }
    const fn = triggerToFunction(passkeyNode.attributes.onclickTrigger)
    if (fn) {
      fn()
    } else {
      console.error("Passkey node trigger function not found")
    }
  }

  useEffect(() => {
    if (!passkeyNode.attributes.onclickTrigger) {
      console.error("Passkey node not found")
      return
    }
    const fn = triggerToFunction(passkeyNode.attributes.onclickTrigger)

    setPasskeyScriptInitalized(typeof fn === "function")
  }, [passkeyNode])

  useEventListener("oryWebAuthnInitialized" as keyof WindowEventMap, () => {
    setPasskeyScriptInitalized(true)
  })

  useTimeout(() => {
    if (!isPasskeyScriptInitalized) {
      setFailedToLoad(true)
    }
  }, 5000)

  if (failedToLoad) {
    return (
      <ListItem
        as="button"
        icon={Icon}
        disabled={true}
        title={intl.formatMessage(
          { id: title?.id ?? `two-step.${group}.title` },
          title?.values,
        )}
        description={intl.formatMessage({
          id: "two-step.passkey.description.error",
        })}
        type="button"
        data-testid={`ory/form/auth-picker/${group}`}
      >
        <AlertIcon />
      </ListItem>
    )
  }

  return (
    <ListItem
      as="button"
      icon={Icon}
      disabled={!isPasskeyScriptInitalized || !formState.isReady}
      name={passkeyNode.attributes.name}
      title={intl.formatMessage(
        { id: title?.id ?? `two-step.${group}.title` },
        title?.values,
      )}
      description={intl.formatMessage({
        id: `two-step.${group}.description`,
      })}
      onClick={clickHandler}
      type="button"
      data-testid={`ory/form/auth-picker/${group}`}
    />
  )
}
