# Ory Elements

> [!CAUTION] This example uses an outdated version of Ory Elements. Please
> use example [`nextjs-spa`](../nextjs-spa/README.md) instead.

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

## Get Started

```shell
git clone --depth 1 git@github.com:ory/elements.git
cd elements
npm run initialize
npm run build:clean
cd examples/react-spa
export VITE_ORY_SDK_URL=http://localhost:4000
npm run dev -- --port 3000
```

Now run the [Ory CLI](https://www.ory.sh/docs/guides/cli/installation) tunnel.

```shell
ory tunnel http://localhost:3000 --project <project-slug> --dev
```

The tunnel will now _mirror_ the Ory APIs under `http://localhost:4000` which we
have explicity told our React app to use through the `VITE_ORY_SDK_URL` export.

Now you can see Ory Elements in action by opening <http://localhost:3000> in
your browser!

### Ory OAuth flows

Ory Network supports OAuth single sign on (SSO) flows. This is applicable to use
cases where you have multiple first-party applications sharing the same user
pool, e.g. sign in on app A and app B with the same credentials.

Another use case is sharing user data with third party providers. In this case
you are the provider and allow third party apps to sign in your users without
needing access to their credentials. For example "sign in with Google", you are
Google in this scenario.

<https://www.ory.sh/docs/hydra/guides/custom-ui-oauth2>

You can try it out locally using the following steps:

1. Create an Ory Network project

```shell
ory create project --name "TestOAuth"
```

2. Create an OAuth Client

```shell
ory create oauth2-client \
  --project ORY_NETWORK_PROJECT_SLUG_OR_ID \
  --name YOUR_CLIENT_NAME \
  --grant-type authorization_code,refresh_token \
  --response-type code,id_token \
  --scope openid,offline \
  --redirect-uri http://127.0.0.1:5555/callback
```

3. Run the Ory CLI tunnel

```shell
ory tunnel http://localhost:3000 --dev --project <slug>
```

4. Run the React application

```shell
export VITE_ORY_SDK_URL=http://localhost:4000
npm run dev
```

5. Perform an OAuth flow

This is using a test OAuth client, this would be another application / service
or Ory Network project.

```shell
ory perform authorization-code \
  --client-id ORY_CLIENT_ID \
  --client-secret ORY_CLIENT_SECRET \
  --project ORY_PROJECT_ID \
  --port 5555 \
  --scope openid,offline
```

**Please take note to initiate the OAuth flow through the Ory tunnel on
<http://localhost:4000> instead of your project slug oryapis URL.**

For example:

```diff
- https://<project-slug>.projects.oryapis.com/oauth2/auth
+ http://localhost:4000/oauth2/auth
?audience=&client_id=77e447a8-f0b9-42dc-8d75-676a8ebf5e2e&max_age=0&nonce=mwlotcnpyfytjfwmcxsklnnm&prompt=&redirect_uri=http%3A%2F%2F127.0.0.1%3A5555%2Fcallback&response_type=code&scope=openid+offline&state=hcmykhxolygmattztdednkrs
```

The reason for this is so that cookies can be set correctly on localhost. When
deploying to production you will use your own domain attached to your Ory
Network project.

### Using and Modifying the Example

If you want to re-use this example in your own project, you can do so by
installing the dependencies through NPM instead of using the latest build from
master.

```shell
cp -r examples/react-spa <your-project>
cd <your-project>
npm i @ory/elements @ory/client
```

### End-to-End Testing

This example comes with a set of end-to-end tests that can be run with
`npm run test`. The tests are written with [Playwright](https://playwright.dev/)
and can be found in the `e2e` directory.

To use the tests, you need to have [Playwright](https://playwright.dev/) and
`@ory/elements-test` installed as a dev dependency.

For more details, see [End-to-End Testing](../../packages/test/README.md).

### Contributing

Found a bug or want to add a new feature? Please fork this repository and create
a pull request. If your changes are large please open an issue first.
