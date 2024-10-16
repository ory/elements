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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-full">
          <DefaultHorizontalDivider />
        </div>
        <div className="flex gap-6 items-center col-span-full">
          <div className="size-8 aspect-square ">
            <QrCode size={32} />
          </div>
          <div className="flex flex-col mr-auto">
            <p className="text-dialog-fg-subtle text-sm font-medium">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-full">
          <DefaultHorizontalDivider />
        </div>
        <div className="bg-dialog-bg-subtle p-8 rounded-xl flex justify-center">
          <div className="h-44 aspect-square bg-[white] rounded">
            <div className="mix-blend-multiply -m-3 antialiased">
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
