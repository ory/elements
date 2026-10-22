// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentResourceProps } from "@ory/elements-react"
import IconGlobe from "../../assets/icons/globe.svg"
import { ListItem } from "../card/list-item"

export function DefaultConsentResource({
  resource,
}: OryNodeConsentResourceProps) {
  return (
    <ListItem
      icon={IconGlobe}
      title={resource}
      description=""
      className="col-span-2 cursor-default break-all hover:bg-ui-transparent"
      data-testid="ory/screen/consent/resource"
    />
  )
}
