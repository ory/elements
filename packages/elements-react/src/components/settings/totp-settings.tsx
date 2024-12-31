// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"

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
  const { setValue } = useFormContext()

  const totpUnlink = getTotpUnlinkInput(nodes)
  const qrNode = getQrCodeNode(nodes)
  const secretNode = getTotpSecretNode(nodes)
  const totpCodeNode = getTotpInputNode(nodes)
  const totpLinkButton = getTotpLinkButton(nodes)

  const handleUnlink = () => {
    if (totpUnlink?.attributes.node_type === "input") {
      setValue(totpUnlink.attributes.name, totpUnlink.attributes.value)
      setValue("method", "totp")
    }
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage({ id: "settings.totp.title" })}
        description={intl.formatMessage({ id: "settings.totp.description" })}
      >
        <Form.TotpSettings
          totpImage={qrNode}
          totpSecret={secretNode}
          totpInput={totpCodeNode}
          totpUnlink={totpUnlink}
          onUnlink={handleUnlink}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={
          totpUnlink
            ? intl.formatMessage({ id: "settings.totp.info.linked" })
            : intl.formatMessage({ id: "settings.totp.info.not-linked" })
        }
      >
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
