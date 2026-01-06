// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { Session, Identity } from "@ory/client-fetch"

export type UserInitials = {
  primary: string
  secondary?: string
  avatar?: string
}

function isTraitsIndexable(
  traits: unknown,
): traits is Record<string, string | Record<string, string>> {
  return typeof traits === "object" && traits !== null
}

/**
 * Get user initials and display info from session or identity
 */
export function getUserInitials(
  sessionOrIdentity: Session | Identity | null | undefined,
): UserInitials {
  const avatar = ""
  let primary = ""
  let secondary = ""

  // Handle both Session and Identity objects
  let identity: Identity | null | undefined
  if (sessionOrIdentity && "identity" in sessionOrIdentity) {
    identity = sessionOrIdentity.identity
  } else {
    identity = sessionOrIdentity as Identity | null | undefined
  }

  if (!identity?.traits || !isTraitsIndexable(identity.traits)) {
    return {
      primary,
      secondary,
      avatar,
    }
  }

  const traits = identity.traits

  if (traits.email && typeof traits.email === "string") {
    secondary = traits.email
  }

  if (traits.name) {
    if (typeof traits.name === "string") {
      primary = traits.name
    }

    if (
      typeof traits.name === "object" &&
      traits.name &&
      traits.name.first &&
      traits.name.last
    ) {
      primary = traits.name.first + " " + traits.name.last
    }
  }

  if (primary === "") {
    primary = secondary
    secondary = ""
  }

  return {
    primary,
    secondary,
    avatar,
  }
}
