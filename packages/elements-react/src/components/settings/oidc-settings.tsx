// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { OryNodeSettingsButton } from "."
import { useComponents } from "../../context"
import { isUiNodeInput, UiNodeInput } from "../../util/utilFixSDKTypesHelper"

const getLinkButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter(
      (node) => "name" in node.attributes && node.attributes.name === "link",
    )
    .filter(isUiNodeInput)

const getUnlinkButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter(
      (node) => "name" in node.attributes && node.attributes.name === "unlink",
    )
    .filter(isUiNodeInput)

export interface HeadlessSettingsOidcProps {
  nodes: UiNode[]
}

export function OrySettingsOidc({ nodes }: HeadlessSettingsOidcProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

  const linkButtons: OryNodeSettingsButton[] = getLinkButtons(nodes).map(
    (node) => {
      const clickHandler = function () {
        if (node.attributes.node_type === "input") {
          setValue("link", node.attributes.value)
          setValue("method", node.group)
        }
      }
      return {
        ...node,
        onClick: clickHandler,
        buttonProps: {
          name: node.attributes.name,
          value: node.attributes.value,
          onClick: clickHandler,
          type: "submit",
        },
      }
    },
  )

  const unlinkButtons: OryNodeSettingsButton[] = getUnlinkButtons(nodes).map(
    (node) => {
      const clickHandler = function () {
        if (node.attributes.node_type === "input") {
          setValue("unlink", node.attributes.value)
          setValue("method", node.group)
        }
      }
      return {
        ...node,
        onClick: clickHandler,
        buttonProps: {
          name: node.attributes.name,
          value: node.attributes.value,
          onClick: clickHandler,
          type: "submit",
        },
      }
    },
  )

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.oidc.title" })}
        description={intl.formatMessage({ id: "settings.oidc.description" })}
      >
        <Form.SsoSettings
          linkButtons={linkButtons}
          unlinkButtons={unlinkButtons}
          isSubmitting={formState.isSubmitting}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({ id: "settings.oidc.info" })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
