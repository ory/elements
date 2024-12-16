// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import { OrySettingsTotpProps } from "@ory/elements-react"
import { DefaultInput } from "../form/input"
import { DefaultImage } from "../form/image"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"
import { DefaultLabel } from "../form/label"
import QrCode from "../../assets/icons/qrcode.svg"
import Trash from "../../assets/icons/trash.svg"

export function DefaultSettingsTotp(props: OrySettingsTotpProps) {
  if ("totpUnlink" in props && props.totpUnlink) {
    const {
      type,
      autocomplete: _ignoredAutocomplete,
      label: _ignoredLabel,
      node_type: _ignoredNodeType,
      ...buttonAttrs
    } = props.totpUnlink?.attributes as UiNodeInputAttributes

    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full">
          <DefaultHorizontalDivider />
        </div>
        <div className="col-span-full flex items-center gap-6">
          <div className="aspect-square size-8 ">
            <QrCode size={32} />
          </div>
          <div className="mr-auto flex flex-col">
            <p className="text-sm font-medium text-dialog-fg-subtle">
              Authenticator app
            </p>
          </div>
          <button
            type={type === "button" ? "button" : "submit"}
            {...buttonAttrs}
          >
            <Trash
              size={24}
              className="text-links-link-mute-default hover:text-links-link-mute-hover"
            />
          </button>
        </div>
      </div>
    )
  }

  if ("totpSecret" in props) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full">
          <DefaultHorizontalDivider />
        </div>
        <div className="flex justify-center rounded-xl bg-dialog-bg-subtle p-8">
          <div className="aspect-square h-44 rounded bg-[white]">
            <div className="-m-3 antialiased mix-blend-multiply">
              <DefaultImage
                node={props.totpImage}
                attributes={{
                  ...(props.totpImage.attributes as UiNodeImageAttributes),
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <DefaultLabel
            node={props.totpSecret}
            attributes={props.totpSecret.attributes as UiNodeInputAttributes}
          >
            <DefaultInput
              node={props.totpSecret}
              attributes={{
                disabled: true,
                name: "totp_secret_key",
                node_type: "input",
                type: "text",
                value: (props.totpSecret.attributes as UiNodeTextAttributes)
                  .text.text,
              }}
            />
          </DefaultLabel>
          <DefaultLabel
            attributes={props.totpInput.attributes as UiNodeInputAttributes}
            node={props.totpInput}
          >
            <DefaultInput
              node={props.totpInput}
              attributes={props.totpInput.attributes as UiNodeInputAttributes}
            />
          </DefaultLabel>
        </div>
      </div>
    )
  }
}
