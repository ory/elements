// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiContainer,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { OryCardAuthMethodListItemProps, useOryFlow } from "@ory/elements-react"
import { useEffect, useState } from "react"
import { defineMessages, useIntl } from "react-intl"
import { useEventListener, useTimeout } from "usehooks-ts"
import { kratosMessages } from "../../../../util/i18n/generated/kratosMessages"
import { findCodeIdentifierNode, triggerToFunction } from "../../../../util/ui"
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

const titles = defineMessages<string>({
  [UiNodeGroupEnum.Password]: {
    id: "two-step.password.title",
    defaultMessage: "Password",
  },
  [UiNodeGroupEnum.Code]: {
    id: "two-step.code.title",
    defaultMessage: "Email code",
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: "two-step.webauthn.title",
    defaultMessage: "Security key",
  },
  [UiNodeGroupEnum.Passkey]: {
    id: "two-step.passkey.title",
    defaultMessage: "Passkey (recommended)",
  },
  [UiNodeGroupEnum.Totp]: {
    id: "two-step.totp.title",
    defaultMessage: "Use your Authenticator App (TOTP)",
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: "two-step.lookup_secret.title",
    defaultMessage: "Backup recovery code",
  },
})

export const descriptions = defineMessages<string>({
  [UiNodeGroupEnum.Password]: {
    id: "two-step.password.description",
    defaultMessage: "Enter your password associated with your account",
  },
  [UiNodeGroupEnum.Code]: {
    id: "two-step.code.description",
    defaultMessage: "A verification code will be sent to your email",
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: "two-step.webauthn.description",
    defaultMessage: "Use your security key to authenticate",
  },
  [UiNodeGroupEnum.Passkey]: {
    id: "two-step.passkey.description",
    defaultMessage: "Use your device's for fingerprint or face recognition",
  },
  [UiNodeGroupEnum.Totp]: {
    id: "two-step.totp.description",
    defaultMessage: "Use a 6-digit one-time code from your authenticator app",
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: "two-step.lookup_secret.description",
    defaultMessage: "Use up one of your 8-digit backup codes to authenticate",
  },
})

// TODO: change group to UiNodeGroupEnum throughout
function formatTitle(
  group: string,
  nodes: UiNode[],
  intl: ReturnType<typeof useIntl>,
): string {
  const fallbackTitle = { id: `two-step.${group}.title` }

  if (group === "code") {
    const identifier = findCodeIdentifierNode(nodes)?.attributes?.value
    if (identifier) {
      return intl.formatMessage(kratosMessages["1010023"], {
        address: identifier,
      })
    }
  }

  return intl.formatMessage(titles[group] ?? fallbackTitle)
}

export function DefaultAuthMethodListItem({
  onClick,
  group,
  disabled,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null
  const { flow } = useOryFlow()

  if (group === "passkey") {
    const passkeyNode = findPasskeyNode(flow)
    if (!passkeyNode) {
      // If the passkey node is not found, we return null
      // to avoid rendering the list item.
      // Shouldn't happen, but just in case.
      console.error("Passkey node not found")
      return null
    }

    return <PasskeyListItem passkeyNode={passkeyNode} disabled={disabled} />
  }

  const fallbackDescription = { id: `two-step.${group}.description` }
  return (
    <ListItem
      as="button"
      icon={Icon}
      title={formatTitle(group, flow.ui.nodes, intl)}
      description={intl.formatMessage(
        descriptions[group] ?? fallbackDescription,
      )}
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? "submit" : "button"}
      data-testid={`ory/form/auth-picker/${group}`}
      disabled={disabled}
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
  passkeyNode: { attributes: UiNodeInputAttributes }
  disabled?: boolean
}

function PasskeyListItem({ passkeyNode, disabled }: PasskeyListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap.passkey || null

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
        title={intl.formatMessage(titles.passkey)}
        description={intl.formatMessage({
          id: "two-step.passkey.description.error",
          defaultMessage:
            "Could not load the necessary libraries to use your Passkey. Please try again later.",
        })}
        type="button"
        data-testid={`ory/form/auth-picker/passkey`}
      >
        <AlertIcon />
      </ListItem>
    )
  }

  return (
    <ListItem
      as="button"
      icon={Icon}
      disabled={!isPasskeyScriptInitalized || disabled}
      name={passkeyNode.attributes.name}
      title={intl.formatMessage(titles.passkey)}
      description={intl.formatMessage(descriptions.passkey)}
      onClick={clickHandler}
      type="button"
      data-testid={`ory/form/auth-picker/passkey`}
    />
  )
}
