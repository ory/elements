// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { isUiNodeText, UiNodeText } from "./utilFixSDKTypesHelper"

/**
 * The ID prefix of the text nodes that list the RFC 8707 resource indicators
 * of an OAuth2 consent request.
 *
 * @group Utilities
 */
export const requestedResourceNodeIdPrefix = "requested_resource_"

/**
 * The ID of the text node that introduces the requested resources of an OAuth2
 * consent request.
 *
 * @group Utilities
 */
export const requestedResourcesTitleNodeId = "requested_resources_title"

/**
 * Whether a node lists one requested resource of an OAuth2 consent request.
 *
 * @param node - The node to check.
 * @returns whether the node is a requested resource text node.
 * @group Utilities
 */
export function isRequestedResourceNode(node: UiNode): node is UiNodeText {
  return (
    node.group === UiNodeGroupEnum.Oauth2Consent &&
    isUiNodeText(node) &&
    node.attributes.id.startsWith(requestedResourceNodeIdPrefix)
  )
}
