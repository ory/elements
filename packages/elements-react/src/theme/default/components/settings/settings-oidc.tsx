// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OrySettingsSsoProps,
  UiNodeInput,
  useComponents,
} from "@ory/elements-react"
import { useEffect } from "react"
import { useDebounceValue } from "usehooks-ts"
import { omitInputAttributes } from "../../../../util/omitAttributes"
import Trash from "../../assets/icons/trash.svg"
import logos from "../../provider-logos"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { Spinner } from "../form/spinner"
import { GenericLogo } from "../form/sso"

export function extractProvider(
  context: object | undefined,
): string | undefined {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return undefined
}

export function DefaultSettingsOidc({
  linkButtons,
  unlinkButtons,
  isSubmitting,
}: OrySettingsSsoProps) {
  const hasLinkButtons = linkButtons.length > 0
  const hasUnlinkButtons = unlinkButtons.length > 0
  const { Node } = useComponents()

  return (
    <div className="flex flex-col gap-8">
      {hasLinkButtons && (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3">
          {linkButtons.map((button) => {
            return (
              <Node.SsoButton
                key={button.attributes.value}
                node={button}
                buttonProps={button.buttonProps}
                attributes={button.attributes}
                isSubmitting={isSubmitting}
                provider={(button.attributes.value + "").split("-")[0]}
              />
            )
          })}
        </div>
      )}
      {hasUnlinkButtons && hasLinkButtons ? <DefaultHorizontalDivider /> : null}
      {unlinkButtons.map((button) => {
        if (button.attributes.node_type !== "input") {
          return null
        }
        return (
          <UnlinkRow
            key={button.attributes.value}
            button={button}
            isSubmitting={isSubmitting}
          />
        )
      })}
    </div>
  )
}

type UnlinkRowProps = {
  button: UiNodeInput & { onClick: () => void }
  isSubmitting: boolean
}

function UnlinkRow({ button, isSubmitting }: UnlinkRowProps) {
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)
  const provider = extractProvider(button.meta.label?.context) ?? ""
  const Logo = logos[(button.attributes.value as string).split("-")[0]]

  const localOnClick = () => {
    button.onClick()
    setClicked(true)
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-6">
        {Logo ? (
          <Logo size={32} />
        ) : (
          <GenericLogo label={provider.slice(0, 1)} />
        )}
        <p className="text-sm font-medium text-interface-foreground-default-secondary">
          {provider}
        </p>
      </div>
      <button
        {...omitInputAttributes(button.attributes)}
        type="submit"
        onClick={localOnClick}
        disabled={isSubmitting}
        className="relative"
        title={`Unlink ${provider}`}
      >
        {clicked ? (
          <Spinner className="relative" />
        ) : (
          <Trash
            className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
            size={24}
          />
        )}
      </button>
    </div>
  )
}
