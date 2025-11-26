// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { omit } from "../theme/default/utils/attributes"

export function omitInputAttributes({
  ...attrs
}: Partial<Record<keyof UiNodeInputAttributes, unknown>>) {
  return omit(attrs, [
    "autocomplete",
    "label",
    "node_type",
    "maxlength",
    "onclick",
    "onclickTrigger",
    "onload",
    "onloadTrigger",
  ])
}
