// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { GenericError } from "@ory/client"

export * from "./login"
export * from "./recovery"
export * from "./registration"
export * from "./settings"
export * from "./verification"

export const sessionForbiddenFixture: GenericError = {
  code: 401,
  status: "Unauthorized",
  request: "3e5ab082-3be2-9cba-b7ff-30d980a9b122",
  reason: "No valid session credentials found in the request.",
  message: "The request could not be authorized",
}
