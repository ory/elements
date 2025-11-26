// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { Node, OrySettingsTotpProps, useComponents } from "@ory/elements-react"
import {
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "../../../../util/utilFixSDKTypesHelper"
import QrCode from "../../assets/icons/qrcode.svg"
import Trash from "../../assets/icons/trash.svg"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { Spinner } from "../form/spinner"

export function DefaultSettingsTotp({
  totpImage,
  totpInput,
  totpSecret,
  totpUnlink,
  onUnlink,
  isSubmitting,
}: OrySettingsTotpProps) {
  if (totpUnlink) {
    return (
      <SettingsTotpUnlink
        totpUnlinkAttributes={totpUnlink.attributes}
        onUnlink={onUnlink}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (totpImage && totpSecret && totpInput) {
    return (
      <SettingsTotpLink
        totpImage={totpImage}
        totpSecret={totpSecret}
        totpInput={totpInput}
      />
    )
  }
}

type SettingsTotpUnlinkProps = {
  totpUnlinkAttributes: UiNodeInputAttributes
  onUnlink: () => void
  isSubmitting: boolean
}

function SettingsTotpUnlink({
  totpUnlinkAttributes,
  onUnlink,
  isSubmitting,
}: SettingsTotpUnlinkProps) {
  const { Card } = useComponents()
  const {
    type,
    autocomplete: _ignoredAutocomplete,
    label: _ignoredLabel,
    node_type: _ignoredNodeType,
    ...buttonAttrs
  } = totpUnlinkAttributes

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <Card.Divider />
      </div>
      <div className="col-span-full flex items-center gap-6">
        <div className="aspect-square size-8">
          <QrCode size={32} />
        </div>
        <div className="mr-auto flex flex-col">
          <p className="text-sm font-medium text-interface-foreground-default-primary">
            Authenticator app
          </p>
        </div>
        <button
          type={type === "button" ? "button" : "submit"}
          {...buttonAttrs}
          onClick={onUnlink}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="relative" />
          ) : (
            <Trash
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              size={24}
            />
          )}
        </button>
      </div>
    </div>
  )
}

type SettingsTotpLinkProps = {
  totpImage: UiNodeImage
  totpSecret: UiNodeText
  totpInput: UiNodeInput
}

function SettingsTotpLink({
  totpImage,
  totpSecret,
  totpInput,
}: SettingsTotpLinkProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <DefaultHorizontalDivider />
      </div>
      <div className="flex justify-center rounded-cards bg-interface-background-default-secondary p-8">
        <div className="aspect-square h-44 bg-[white]">
          <div className="-m-3 antialiased mix-blend-multiply">
            <Node node={totpImage} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Node node={totpSecret} />
        <Node node={totpInput} />
      </div>
    </div>
  )
}
