// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Configuration, FrontendApi, IdentityApi, OAuth2Api } from "@ory/client"

export const apiBaseUrl =
  process.env.ORY_SDK_URL || "https://playground.projects.oryapis.com"

const hydraBaseOptions: any = {}

if (process.env.MOCK_TLS_TERMINATION) {
  hydraBaseOptions.headers = { "X-Forwarded-Proto": "https" }
}

// Sets up the SDK
const sdk = {
  basePath: apiBaseUrl,
  frontend: new FrontendApi(
    new Configuration({
      basePath: apiBaseUrl,
    }),
  ),
  oauth2: new OAuth2Api(
    new Configuration({
      basePath: apiBaseUrl,
    }),
  ),
  identity: new IdentityApi(
    new Configuration({
      basePath: apiBaseUrl,
    }),
  ),
}

export default sdk
