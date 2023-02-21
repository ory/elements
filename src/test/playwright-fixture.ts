// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi } from "@ory/client"
import { test as base } from "@playwright/test"

type TestFixtures = {
  sdk: FrontendApi
  environment: {
    applicationUrl: string
    proxyUrl: string
  }
}

export const test = base.extend<TestFixtures>({
  environment: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const environment = {
        applicationUrl: process.env.APPLICATION_URL || "http://localhost:3000",
        proxyUrl: process.env.PROXY_URL || "http://localhost:4000",
      }
      await use(environment)
    },
    { auto: false },
  ],
  sdk: [
    async ({ environment }, use) => {
      const sdk = new FrontendApi(
        new Configuration({
          basePath: environment.proxyUrl,
        }),
      )
      await use(sdk)
    },
    { auto: false },
  ],
})
