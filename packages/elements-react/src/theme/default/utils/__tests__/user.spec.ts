// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getUserInitials, UserInitials } from "../user"
import { Identity, Session } from "@ory/client-fetch"

const identityBase: Identity = {
  id: "",
  schema_id: "",
  schema_url: "",
  traits: {},
}

describe("getUserInitials", () => {
  test("should return empty strings for primary, secondary, and avatar when no session is provided", () => {
    const result: UserInitials = getUserInitials(null)
    expect(result).toEqual({
      primary: "",
      secondary: "",
      avatar: "",
    })
  })

  test("should return the email as secondary if provided in session traits", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {
          email: "test@example.com",
        },
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "test@example.com",
      secondary: "",
      avatar: "",
    })
  })

  test("should return the name if it is a string", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {
          name: "John Doe",
        },
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "John Doe",
      secondary: "",
      avatar: "",
    })
  })

  test("should return the first and last name when provided as separate traits", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {
          name: {
            first: "John",
            last: "Doe",
          },
        },
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "John Doe",
      secondary: "",
      avatar: "",
    })
  })

  test("should return the email as secondary if name traits are present but primary is empty", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {
          email: "test@example.com",
          name: {},
        },
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "test@example.com",
      secondary: "",
      avatar: "",
    })
  })

  test("should prioritize the first and last name over the email when both are provided", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {
          email: "test@example.com",
          name: {
            first: "John",
            last: "Doe",
          },
        },
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "John Doe",
      secondary: "test@example.com",
      avatar: "",
    })
  })

  test("should return empty primary and secondary when session identity is undefined", () => {
    const session: Session = {
      id: "session-id",
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "",
      secondary: "",
      avatar: "",
    })
  })

  test("should return the correct initials when the traits are empty", () => {
    const session: Session = {
      id: "session-id",
      identity: {
        ...identityBase,
        traits: {},
      },
    }
    const result: UserInitials = getUserInitials(session)
    expect(result).toEqual({
      primary: "",
      secondary: "",
      avatar: "",
    })
  })
})
