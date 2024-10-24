// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useComponents } from "../../context"
import { useIntl } from "react-intl"
import { OrySettingsTotpProps } from "."

const getQrCodeNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) => "id" in node.attributes && node.attributes.id === "totp_qr",
  )

const getTotpSecretNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "id" in node.attributes && node.attributes.id === "totp_secret_key",
  )

const getTotpInputNode = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) => "name" in node.attributes && node.attributes.name === "totp_code",
  )

const getTotpUnlinkInput = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) =>
      "name" in node.attributes && node.attributes.name === "totp_unlink",
  )

const getTotpLinkButton = (nodes: UiNode[]): UiNode | undefined =>
  nodes.find(
    (node) => "name" in node.attributes && node.attributes.name === "method",
  )

interface HeadlessSettingsTotpProps {
  nodes: UiNode[]
}

export function OrySettingsTotp({ nodes }: HeadlessSettingsTotpProps) {
  const { Card, Form, Node } = useComponents()
  const intl = useIntl()

  const totpUnlink = getTotpUnlinkInput(nodes)
  const qrNode = getQrCodeNode(nodes)
  const secretNode = getTotpSecretNode(nodes)
  const totpCodeNode = getTotpInputNode(nodes)
  const totpLinkButton = getTotpLinkButton(nodes)

  const props = {
    totpImage: qrNode,
    totpSecret: secretNode,
    totpInput: totpCodeNode,
    totpUnlink: totpUnlink,
  } as OrySettingsTotpProps

  const content = <Form.TotpSettings {...props} />

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.totp.title" })}
        description={intl.formatMessage({ id: "settings.totp.description" })}
      >
        {content}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        <span>
          {totpUnlink
            ? intl.formatMessage({ id: "settings.totp.info.linked" })
            : intl.formatMessage({ id: "settings.totp.info.not-linked" })}
        </span>
        {totpLinkButton && (
          <Node.Button
            node={totpLinkButton}
            attributes={totpLinkButton.attributes as UiNodeInputAttributes}
          />
        )}
      </Card.SettingsSectionFooter>
    </>
  )
}
