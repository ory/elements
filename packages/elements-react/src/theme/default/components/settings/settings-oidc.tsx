// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { OrySettingsSsoProps } from "@ory/elements-react"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"
import Trash from "../../assets/icons/trash.svg"
import logos from "../../provider-logos"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { DefaultButtonSocial, extractProvider, GenericLogo } from "../form/sso"
import { Spinner } from "../form/spinner"
import { omitInputAttributes } from "../../../../util/omitAttributes"

export function DefaultSettingsOidc({
  linkButtons,
  unlinkButtons,
}: OrySettingsSsoProps) {
  const hasLinkButtons = linkButtons.length > 0
  const hasUnlinkButtons = unlinkButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      {hasLinkButtons && (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3">
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
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)
  const {
    formState: { isSubmitting },
  } = useFormContext()
  const attrs = button.attributes as UiNodeInputAttributes
  const provider = extractProvider(button.meta.label?.context) ?? ""
  const Logo = logos[(attrs.value as string).split("-")[0]]

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
    <div key={attrs.value} className="flex justify-between">
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
        {...omitInputAttributes(attrs)}
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
