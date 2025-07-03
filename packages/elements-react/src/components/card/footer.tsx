// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"

export type OryCardFooterProps = Record<string, never>

/**
 *
 * @returns The footer of a card component.
 * @group Components
 */
export function OryCardFooter() {
  const { Card } = useComponents()
  return <Card.Footer />
}
