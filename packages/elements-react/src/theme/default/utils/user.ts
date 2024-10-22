// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"

export type UserInitials = {
  primary: string
  secondary?: string
  avatar?: string
}

export const getUserInitials = (session?: Session): UserInitials => {
  const avatar = ""
  let primary = ""
  let secondary = ""

  if (!session?.identity?.traits) {
    return {
      primary,
      secondary,
      avatar,
    }
  }

  const traits = session.identity?.traits

  if (traits.email) {
    secondary = traits.email
  }

  if (traits.name) {
    if (typeof traits.name === "string") {
      primary = traits.name
    }

    if (traits.name.first && traits.name.last) {
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
