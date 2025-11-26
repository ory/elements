// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../context"
import {
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeText,
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from "../../util/utilFixSDKTypesHelper"
import { Node } from "../form/nodes/node"

const getQrCodeNode = (nodes: UiNode[]): UiNodeImage | undefined =>
  nodes.find(
    (node): node is UiNodeImage =>
      "id" in node.attributes &&
      node.attributes.id === "totp_qr" &&
      isUiNodeImage(node),
  )

const getTotpSecretNode = (nodes: UiNode[]): UiNodeText | undefined =>
  nodes.find<UiNodeText>(
    (node): node is UiNodeText =>
      "id" in node.attributes &&
      node.attributes.id === "totp_secret_key" &&
      isUiNodeText(node),
  )

const getTotpInputNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "totp_code" &&
      isUiNodeInput(node),
  )

const getTotpUnlinkInput = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "totp_unlink" &&
      isUiNodeInput(node),
  )

const getTotpLinkButton = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      "name" in node.attributes &&
      node.attributes.name === "method" &&
      isUiNodeInput(node),
  )

type HeadlessSettingsTotpProps = {
  nodes: UiNode[]
}

export function OrySettingsTotp({ nodes }: HeadlessSettingsTotpProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

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
        {qrNode && secretNode && totpCodeNode && !totpUnlink ? (
          <TotpSettingsLink
            totpImage={qrNode}
            totpSecret={secretNode}
            totpInput={totpCodeNode}
          />
        ) : (
          <Form.TotpSettings
            totpImage={qrNode}
            totpSecret={secretNode}
            totpInput={undefined}
            totpUnlink={totpUnlink}
            onUnlink={handleUnlink}
            isSubmitting={formState.isSubmitting}
          />
        )}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={
          totpUnlink
            ? intl.formatMessage({ id: "settings.totp.info.linked" })
            : intl.formatMessage({ id: "settings.totp.info.not-linked" })
        }
      >
        {totpLinkButton && <Node node={totpLinkButton} />}
      </Card.SettingsSectionFooter>
    </>
  )
}

type TotpSettingsLinkProps = {
  totpImage: UiNodeImage
  totpSecret: UiNodeText
  totpInput: UiNodeInput
}

function TotpSettingsLink({
  totpImage,
  totpSecret,
  totpInput,
}: TotpSettingsLinkProps) {
  const { formState } = useFormContext()
  const { Form } = useComponents()
  return (
    <Form.TotpSettings
      totpImage={totpImage}
      totpSecret={totpSecret}
      totpInput={totpInput}
      totpUnlink={undefined}
      onUnlink={() => {}}
      isSubmitting={formState.isSubmitting}
    />
  )
}
