# Ory Elements Test

Ory Elements provides a testing library built on top of
[Playwright](https://playwright.dev/). It allows you to test your application
integration with Ory automatically.

A lot of tests for common use-cases have been implemented in the library so that
you can focus on only writing tests for your specific edge-cases.

## Installation

You can install [Playwright](https://playwright.dev/) and the Ory Elements Test
library using npm.

---

`@ory/elements-test` only supports playwright 1.32.0 or higher. If you are using
an older version of playwright, please update it.

---

```shell
npm i @ory/elements-test @playwright/test --save-dev
```

To set up the playwright configuration, run the following command:

```shell
npm init playwright@latest
```

## Usage

Playwright should have created a `playwright.config.ts` file in your project.

Here, we will add your application web server configurations, environment setup
and specify which directory contains your tests. In this example, all tests will
be located in the `e2e` directory under the root of your project.

Environment variables can be setup through a bash script or any other method you
prefer. In this example, we will add the `APPLICATION_URL` and `ORY_PROJECT_URL`
environment variables inside the `global-setup.ts` file which should be created
by you in the root of your project.

```ts
const globlSetup = async () => {
  process.env.APPLICATION_URL = "http://localhost:3000"

  process.env.ORY_PROJECT_URL = "http://localhost:4000"
}

export default globlSetup
```

Below is an example of running Next.js on port 3000.

```ts
/* Run your local dev server before starting the tests */
  webServer: [
    {
      env: {
        NEXT_PUBLIC_ORY_SDK_URL: "http://localhost:4000",
      },
      command: "npm run dev -- --port 3000",
      timeout: 120 * 1000,
      port: 3100,
      reuseExistingServer: !process.env.CI,
    },
    // ...
    // other web servers
  ],
```

To test against an Ory Network project, add the Ory Tunnel to your
configuration.

```ts
/* Run your local dev server before starting the tests */
webServer: [
  {
    env: {
      APPLICATION_URL: "http://localhost:3000", // <-- the url where your application is running
      ORY_PROJECT_URL: "http://localhost:4000",
    },
    command: "ory tunnel ${APPLICATION_URL} ${ORY_PROJECT_URL} -q",
    port: 4000,
  },
  // ...
  // other web servers
]
```

## Writing Tests

```ts
import { LoginMocks, LoginPage, test } from "@ory/elements-test"

test.describe.parallel("Login Page", () => {
  test("login success", async ({ environment, page }) => {
    // get the application url and ory project url from the environment
    // variables
    // APPLICATION_URL is the url where your application is running
    // ORY_PROJECT_URL is the url of the Ory tunnel mirroring your Ory Network project (in this case we mock it)
    const { applicationUrl, oryProjectUrl } = environment
    // create a new login page instance
    // the login page instance contains helper
    // functions for selecting elements on the page
    const loginPage = new LoginPage(page, applicationUrl, oryProjectUrl)
    // We run the login success mock test from the `@ory/elements-test` library
    await LoginMocks.LoginSuccessTest(loginPage)
  })
})
```
