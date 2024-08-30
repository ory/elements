// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { test as base } from "@playwright/test"

interface TestFixtures {
  environment: {
    applicationUrl: string
    oryProjectUrl: string
    projectApiToken: string
  }
}

export const test = base.extend<TestFixtures>({
  environment: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      const environment = {
        // applicationUrl is the URL where the application is running
        // this should be the custom domain where these tests will be run on
        // e.g. https://app.example.com
        applicationUrl: process.env.APPLICATION_URL ?? "http://localhost:3000",
        // oryProjectUrl is the Ory Network API URL
        // this should be the custom domain where these tests will be run on
        // e.g. https://auth.example.com which points to https://<slug>.projects.oryapis.com
        // use the ory cli tunnel url instead if you are running tests locally without a custom domain.
        oryProjectUrl: process.env.ORY_PROJECT_URL ?? "http://localhost:4000",
        // projectApiToken is the Ory Network API token
        // this should only be used when running tests that alter the state of the Ory project
        // for example when creating a new user
        // and deleting it after the test has run
        projectApiToken: process.env.ORY_PROJECT_API_TOKEN ?? "",
      }
      await use(environment)
    },
    { auto: false },
  ],
})
