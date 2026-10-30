// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { omit } from "../theme/default/utils/attributes"
import { UiNodeInputAttributesWithOptions } from "./utilFixSDKTypesHelper"

export function omitInputAttributes({
  ...attrs
}: Partial<Record<keyof UiNodeInputAttributesWithOptions, unknown>>) {
  return omit(attrs, [
    "autocomplete",
    "inputmode",
    "label",
    "node_type",
    "maxlength",
    "onclick",
    "onclickTrigger",
    "onload",
    "onloadTrigger",
  ])
}
