// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Session } from "@ory/client-fetch"
import type { OryClientConfiguration } from "../composables/useOryConfig"
import type { OryFlowComponents } from "../composables/useComponents"
import type { OryFlowContainer } from "../util/flowContainer"

/**
 * Props for the OryProvider component
 */
export interface OryProviderProps {
  flowContainer: OryFlowContainer
  config: OryClientConfiguration
  components: OryFlowComponents
}

/**
 * Props for the OryPageHeader component
 */
export interface OryPageHeaderProps {
  session?: Session | null
  logoutUrl?: string
}
