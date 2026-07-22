// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import {
  settingsCardDescriptions,
  settingsCardTitles,
} from "../../util/i18n/settingsCardMessages"
import { isUiNodeInput, UiNodeInput } from "../../util/utilFixSDKTypesHelper"

const getRemoveButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter(
      (node) =>
        "name" in node.attributes &&
        node.attributes.name === "deviceauthn_remove",
    )
    .filter(isUiNodeInput)

type HeadlessSettingsDeviceauthnProps = {
  nodes: UiNode[]
}

export function OrySettingsDeviceauthn({
  nodes,
}: HeadlessSettingsDeviceauthnProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()
  const removeButtons = getRemoveButtons(nodes)

  if (removeButtons.length === 0) {
    return null
  }

  const removeDeviceauthnKeyHandler = (value: string) => {
    return () => {
      setValue("deviceauthn_remove", value)
      setValue("method", "deviceauthn")
    }
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.deviceauthn)}
        description={intl.formatMessage(settingsCardDescriptions.deviceauthn)}
      >
        <Form.DeviceauthnSettings
          isSubmitting={formState.isSubmitting}
          removeButtons={removeButtons.map((node) => {
            const onClick = removeDeviceauthnKeyHandler(
              node.attributes.value as string,
            )
            return {
              ...node,
              onClick,
              buttonProps: {
                name: node.attributes.name,
                value: node.attributes.value,
                onClick,
                type: "submit",
              },
            }
          })}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: "settings.deviceauthn.info",
          defaultMessage:
            "Trusted devices are used to authenticate with registered mobile devices",
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
