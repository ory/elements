// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useComponents } from "../../context"
import { useIntl } from "react-intl"

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

  const linkButtons = getLinkButtons(nodes)
  const unlinkButtons = getUnlinkButtons(nodes)

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.oidc.title" })}
        description={intl.formatMessage({ id: "settings.oidc.description" })}
      >
        <Form.OidcSettings
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
