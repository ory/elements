// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../../../context"
import { UiNodeText } from "../../../../util/utilFixSDKTypesHelper"

export function ConsentResourceRenderer({ node }: { node: UiNodeText }) {
  const { Node } = useComponents()
  if (!Node.ConsentResource) {
    return <Node.Text node={node} attributes={node.attributes} />
  }
  return (
    <Node.ConsentResource node={node} resource={node.attributes.text.text} />
  )
}
