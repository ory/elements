// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"

export type OryCardHeaderProps = Record<string, never>

/**
 * Returns the header of the Ory Card.
 *
 * @returns The header of the Ory Card.
 * @group Components
 */
export function OryCardHeader() {
  const { Card } = useComponents()
  return <Card.Header />
}
