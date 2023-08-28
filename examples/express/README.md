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

## Get Started

```shell
git clone --depth 1 git@github.com:ory/elements.git
cd elements
npm run initialize
cd examples/express
export ORY_SDK_URL=http://localhost:4000
npm run dev
```

Now run the [Ory CLI](https://www.ory.sh/docs/guides/cli/installation) tunnel.

```shell
ory tunnel http://localhost:3000 --project <project-slug> --dev
```

The tunnel will now _mirror_ the Ory APIs under `http://localhost:4000` which we
have explicity told our Express.JS app to use through the `ORY_SDK_URL`
export.

Now you can see Ory Elements in action by opening <http://localhost:3000> in your
browser!

### Configurations

- `ORY_SDK_URL` (required): The URL where ORY Kratos's Public API is
  located at. If this app and ORY Kratos are running in the same private
  network, this should be the private network address (e.g.
  `kratos-public.svc.cluster.local`).
- `TLS_CERT_PATH` (optional): Path to certificate file. Should be set up
  together with `TLS_KEY_PATH` to enable HTTPS.
- `TLS_KEY_PATH` (optional): Path to key file Should be set up together with
  `TLS_CERT_PATH` to enable HTTPS.

This is the easiest mode as it requires no additional set up. This app runs on
port `:3000`.

### Base Path

There are two ways of serving this application under a base path:

1. Let Express.js handle the routing by setting the `BASE_PATH` environment
   variable to the sub-path, e.g. `/myapp`.
2. Use a reverse proxy or API gateway to strip the path prefix.

The second approach is not always possible, especially when running the
application on a serverless environment. In this case, the first approach is
recommended.

## Development

To run this app with dummy data and no real connection to the Ory Network, use:

```shell script
NODE_ENV=stub npm start
```

### Using and Modifying the Example

If you want to re-use this example in your own project, you can do so by
installing the dependencies through NPM instead of using the latest build from
master.

```shell
cp -r examples/express <your-project>
cd <your-project>
npm i @ory/elements-markup @ory/client @ory/integrtions
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
This application can be configured using two environment variables:
