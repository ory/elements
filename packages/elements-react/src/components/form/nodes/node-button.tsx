// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeGroupEnum } from "@ory/client-fetch"
import { UiNodeInput } from "../../../util/utilFixSDKTypesHelper"
import { NodeRenderer } from "./renderer"

type NodeButtonProps = {
  node: UiNodeInput
}
export function NodeButton({ node }: NodeButtonProps) {
  const isResendNode = node.meta.label?.id === 1070008

  const isScreenSelectionNode =
    "name" in node.attributes && node.attributes.name === "screen"

  if (isResendNode || isScreenSelectionNode) {
    return null
  }
  if (node.group === "oauth2_consent") {
    return null
  }

  const isSocial =
    (node.attributes.name === "provider" || node.attributes.name === "link") &&
    (node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)

  if (isSocial) {
    return <NodeRenderer.SsoButton node={node} />
  }
  return <NodeRenderer.Button node={node} />
}
