# Ory Elements

Ory Elements is a component library that makes building login, registration and
account pages for Ory a breeze.

- Reduces time to add complex auth flows to your customer experience, including
  multi-factor authentication and account recovery
- Themeable and modular - use only what you need from it
- Works with the React ecosystem (NextJS, React SPA, Preact SPA)
- Works with the Express based ecosystem
- Dynamically adapts the user interface to your Ory identity schema, sign-in and
  flow configuration

Ory Elements supports integrating with:

- React
- Preact
- ExpressJs (experimental)

### Get Started

```shell
git clone --depth 1 git@github.com:ory/elements.git
cd elements
npm run initialize
cd examples/nextjs-spa
export NEXT_PUBLIC_ORY_SDK_URL=http://localhost:4000
npm run dev
```

Now run the [Ory CLI](https://www.ory.sh/docs/guides/cli/installation) tunnel.

```shell
ory tunnel http://localhost:3000 --project <project-slug> --dev
```

The tunnel will now _mirror_ the Ory APIs under `http://localhost:4000` which we
have explicity told our NextJS app to use through the `NEXT_PUBLIC_ORY_SDK_URL`
export.

Now you can see Ory Elements in action by opening http://localhost:3000 in your
browser!

#### OAuth2 Login/Consent page

This example provides a working Login/Consent page using the Ory Elements
UserAuthCard and UserConsentCard.

To use the Consent page, the NextJS application will need a Ory API Token set as
an environment variable.

```
export NEXT_ADMIN_ORY_API_KEY=ory_pat_xxxxx
```

The `NEXT_PUBLIC_ORY_SDK_URL` will be used for admin API calls as well since Ory
Network projects expose both endpoint under the same URL.

Take a look at the Ory Documentation to configure your Ory Network project to
use this NextJS application as a custom consent UI.
https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow#consent

### Using and Modifying the Example

If you want to re-use this example in your own project, you can do so by
installing the dependencies through NPM instead of using the latest build from
master.

```shell
cp -r examples/nextjs-spa <your-project>
cd <your-project>
npm i @ory/elements @ory/client
```

Nothing else is required. You can now start modifying the example to your needs.

### End-to-End Testing

This example comes with a set of end-to-end tests that can be run with
`npm run test`. The tests are written with [Playwright](https://playwright.dev/)
and can be found in the `e2e` directory.

To use the tests, you need to have [Playwright](https://playwright.dev/) and
`@ory/elements-test` installed as a dev dependency.

For more details, see [End-to-End Testing](../../packages/test/README.md).

### Contributing

Found a bug or want to add a new feature? Please fork this repository and create
a pull request. If your changes are large, please open an issue first.
