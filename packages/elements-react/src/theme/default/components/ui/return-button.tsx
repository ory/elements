// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow } from "@ory/elements-react"

export const ReturnButton = () => {
  const { config } = useOryFlow()

  return (
    <a
      //TODO: This should redirect to known landing page, as flow ID may change and it could still redirect to same page
      //   href={config}
      className="cursor-pointer text-sm flex items-center gap-1.5 text-links-link-mute-default hover:text-links-link-mute-hover"
    >
      {"<-"} Back
    </a>
  )
}
