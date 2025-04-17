// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
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
import { cn } from "../../utils/cn"
import { omitInputAttributes } from "../../../../util/omitAttributes"

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
          <div className="aspect-square h-44 rounded bg-[white]">
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
            <div className="relative flex justify-stretch max-w-[488px]">
              <input
                disabled
                name="totp_secret_key"
                type="text"
                value={
                  (totpSecret.attributes as UiNodeTextAttributes).text.text
                }
                data-testid={`ory/form/node/input/totp_secret_key`}
                className={cn(
                  "antialiased rounded-forms border leading-tight transition-colors placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus-visible:outline-none focus:ring-0 w-full",
                  "bg-input-background-default border-input-border-default text-input-foreground-primary",
                  "disabled:bg-input-background-disabled disabled:border-input-border-disabled disabled:text-input-foreground-disabled",
                  "focus:border-input-border-focus focus-visible:border-input-border-focus",
                  "hover:bg-input-background-hover hover:border-input-border-hover",
                  "px-4 py-[13px]",
                )}
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
