import { Session } from "@ory/client-fetch"

export type UserInitials = {
  primary: string
  secondary?: string
  avatar?: string
}

export const getUserInitials = (session?: Session): UserInitials => {
  let avatar = ""
  let primary = ""
  let secondary = ""

  if (!session) {
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
