// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeTextAttributes,
} from "@ory/client-fetch"
import { OrySettingsTotpProps, useComponents } from "@ory/elements-react"
import QrCode from "../../assets/icons/qrcode.svg"
import Trash from "../../assets/icons/trash.svg"
import { DefaultHorizontalDivider } from "../form/horizontal-divider"

export function DefaultSettingsTotp(props: OrySettingsTotpProps) {
  const { Node, Card } = useComponents()
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
          <Card.Divider />
        </div>
        <div className="col-span-full flex items-center gap-6">
          <div className="aspect-square size-8 ">
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
          >
            <Trash
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              size={24}
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
        <div className="flex justify-center rounded-cards bg-interface-background-default-secondary p-8">
          <div className="aspect-square h-44 rounded bg-[white]">
            <div className="-m-3 antialiased mix-blend-multiply">
              <Node.Image
                node={props.totpImage}
                attributes={{
                  ...(props.totpImage.attributes as UiNodeImageAttributes),
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Node.Label
            node={props.totpSecret}
            attributes={props.totpSecret.attributes as UiNodeInputAttributes}
          >
            <Node.Input
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
          </Node.Label>
          <Node.Label
            attributes={props.totpInput.attributes as UiNodeInputAttributes}
            node={props.totpInput}
          >
            <Node.Input
              node={props.totpInput}
              attributes={props.totpInput.attributes as UiNodeInputAttributes}
            />
          </Node.Label>
        </div>
      </div>
    )
  }
}
