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
import { useFormContext } from "react-hook-form"
import { Spinner } from "../form/spinner"
import { defaultInputClassName } from "../form/input"

export function DefaultSettingsTotp({
  totpImage,
  totpInput,
  totpSecret,
  totpUnlink,
  onUnlink,
}: OrySettingsTotpProps) {
  const { Node, Card } = useComponents()
  const {
    formState: { isSubmitting },
  } = useFormContext()
  if (totpUnlink) {
    const {
      type,
      autocomplete: _ignoredAutocomplete,
      label: _ignoredLabel,
      node_type: _ignoredNodeType,
      ...buttonAttrs
    } = totpUnlink.attributes as UiNodeInputAttributes

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

  if (totpImage && totpSecret && totpInput) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-full">
          <DefaultHorizontalDivider />
        </div>
        <div className="flex justify-center rounded-cards bg-interface-background-default-secondary p-8">
          <div className="aspect-square h-44 bg-[white]">
            <div className="-m-3 antialiased mix-blend-multiply">
              <Node.Image
                node={totpImage}
                attributes={{
                  ...(totpImage.attributes as UiNodeImageAttributes),
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <Node.Label
            node={totpSecret}
            attributes={totpSecret.attributes as UiNodeInputAttributes}
          >
            <div className="relative flex max-w-[488px] justify-stretch">
              <input
                disabled
                name="totp_secret_key"
                type="text"
                value={
                  (totpSecret.attributes as UiNodeTextAttributes).text.text
                }
                data-testid={`ory/form/node/input/totp_secret_key`}
                className={defaultInputClassName}
              />
            </div>
          </Node.Label>
          <Node.Label
            attributes={totpInput.attributes as UiNodeInputAttributes}
            node={totpInput}
          >
            <Node.CodeInput
              node={totpInput}
              attributes={totpInput.attributes as UiNodeInputAttributes}
            />
          </Node.Label>
        </div>
      </div>
    )
  }
}
