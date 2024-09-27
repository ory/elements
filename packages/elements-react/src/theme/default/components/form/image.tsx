// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeImageProps } from "@ory/elements-react"

export function DefaultImage({ attributes }: OryNodeImageProps) {
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
