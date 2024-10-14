// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { HeadlessImageProps } from "@ory/elements-react"

export function DefaultImage({ attributes }: HeadlessImageProps) {
  // const intl = useIntl()
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
