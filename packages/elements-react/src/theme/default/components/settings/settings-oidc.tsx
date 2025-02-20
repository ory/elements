// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsOidcProps } from "@ory/elements-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import Trash from "../../assets/icons/trash.svg"
import logos from "../../provider-logos"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { DefaultButtonSocial, extractProvider } from "../form/social"
import { Spinner } from "../form/spinner"

export function DefaultSettingsOidc({
  linkButtons,
  unlinkButtons,
}: OrySettingsOidcProps) {
  const hasLinkButtons = linkButtons.length > 0
  const hasUnlinkButtons = unlinkButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      {hasLinkButtons && (
        <div className="grid items-start gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {linkButtons.map((button) => {
            const attrs = button.attributes as UiNodeInputAttributes

            return (
              <DefaultButtonSocial
                showLabel
                key={attrs.value}
                node={button}
                attributes={attrs}
                onClick={button.onClick}
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
        return <UnlinkRow key={button.attributes.value} button={button} />
      })}
    </div>
  )
}

type UnlinkRowProps = {
  button: UiNode & { onClick: () => void }
}

function UnlinkRow({ button }: UnlinkRowProps) {
  const [clicked, setClicked] = useState(false)
  const {
    formState: { isSubmitting },
  } = useFormContext()
  const attrs = button.attributes as UiNodeInputAttributes
  const provider = extractProvider(button.meta.label?.context) ?? ""
  const Logo = attrs.value in logos ? logos[attrs.value] : logos.generic

  const localOnClick = () => {
    button.onClick()
    // Safari cancels form submission events, if we do a state update in the same tick
    // so we delay the state update by 100ms
    setTimeout(() => {
      setClicked(true)
    }, 100)
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting])

  return (
    <div key={attrs.value} className="flex justify-between">
      <div className="flex items-center gap-6">
        <Logo size={32} />
        <p className="text-sm font-medium text-interface-foreground-default-secondary">
          {provider}
        </p>
      </div>
      <button
        {...attrs}
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
