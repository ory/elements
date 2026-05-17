// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardHeader, type OryCardHeaderProps } from "./header"
import { OryCard, type OryCardRootProps } from "./card"
import { OryCardFooter, type OryCardFooterProps } from "./footer"
import { OryCardContent, type OryCardContentProps } from "./content"
import { OrySelfServiceFlowCard } from "./card-two-step"
import { OryConsentCard } from "./card-consent"

export {
  OryCardHeader,
  OryCard,
  OryCardFooter,
  OryCardContent,
  OrySelfServiceFlowCard,
  OryConsentCard,
}

export type {
  OryCardHeaderProps,
  OryCardRootProps as OryCardProps,
  OryCardFooterProps,
  OryCardContentProps,
}
