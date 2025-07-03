// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useComponents } from "../../context"
import { useIntl } from "react-intl"
import { useFormContext } from "react-hook-form"

const getLinkButtons = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) => "name" in node.attributes && node.attributes.name === "link",
  )

const getUnlinkButtons = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) => "name" in node.attributes && node.attributes.name === "unlink",
  )

export interface HeadlessSettingsOidcProps {
  nodes: UiNode[]
}

export function OrySettingsOidc({ nodes }: HeadlessSettingsOidcProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()

  const linkButtons = getLinkButtons(nodes).map((node) => ({
    ...node,
    onClick: () => {
      if (node.attributes.node_type === "input") {
        setValue("link", node.attributes.value)
        setValue("method", node.group)
      }
    },
  }))
  const unlinkButtons = getUnlinkButtons(nodes).map((node) => ({
    ...node,
    onClick: () => {
      if (node.attributes.node_type === "input") {
        setValue("unlink", node.attributes.value)
        setValue("method", node.group)
      }
    },
  }))

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.oidc.title" })}
        description={intl.formatMessage({ id: "settings.oidc.description" })}
      >
        <Form.SsoSettings
          linkButtons={linkButtons}
          unlinkButtons={unlinkButtons}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({ id: "settings.oidc.info" })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
