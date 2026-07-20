// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi, OAuth2Api } from "@ory/client-fetch"

import { orySdkUrl } from "../utils/sdk"

function getProjectApiKey() {
  return process.env["ORY_PROJECT_API_TOKEN"] ?? ""
}

export const serverSideFrontendClient = () =>
  new FrontendApi(
    new Configuration({
      headers: {
        Accept: "application/json",
      },
      basePath: orySdkUrl(),
    }),
  )

export const serverSideOAuth2Client = () => {
  const apiKey = getProjectApiKey()
  return new OAuth2Api(
    new Configuration({
      headers: {
        Accept: "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      basePath: orySdkUrl(),
    }),
  )
}
