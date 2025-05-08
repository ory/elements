// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export type QueryParams = { [key: string]: string | string[] | undefined }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}
