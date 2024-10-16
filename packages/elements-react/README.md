<p align="center">
    <a href="https://ory.sh">
        <img src="https://raw.githubusercontent.com/ory/meta/jonas-jonas/orylogo/static/logos/logo-ory.svg" height="72" />
    </a>
</p>

# @ory/elements-react

<p align="center">
<a aria-label="NPM Version" href="https://www.npmjs.com/package/@ory/elements-react">
<img src="https://img.shields.io/npm/v/@ory/elements-react.svg?style=flat-square">
</a>
<a aria-label="License" href="https://github.com/ory/elements/blob/main/LICENSE">
<img src="https://img.shields.io/github/license/ory/elements?style=flat-square">
</a>
<a aria-label="Join Ory Slack community!" href="https://slack.ory.sh/">
<img src="https://img.shields.io/badge/Slack-Join%20the%20community!-4f46e5?style=flat-square&logo=slack&logoColor=eef2ff">
</a>
</p>

Ory Elements is a set of components and functions tailored for easy integration
of Ory into your React application. It simplifies the process of adding
authentication and other identity features to your application using the Ory
Network.

## Documentation

Visit https://ory.sh/docs to see the full Ory documentation.

## Getting started

**Requirements**

- React `>= 18`
- Node.js `>= 18`
- **`@ory/client-fetch`** - fetch based version of ory client

**Installation**

```sh
npm install @ory/elements-react
```

## Usage

Ory Elements provides components that can aggregate flow objects and display
user authentication flows based on the data.

To feed Ory Elements with flow data you need to use Ory client.

```ts
export function serverClientFrontend() {
  // For testing purposes we're using Ory tunnel

  const config = new Configuration({
    headers: {
      Accept: "application/json",
    },
    basePath: "http://localhost:4000",
  })
  return new FrontendApi(config)
}
```

### Ory Network project setup

The Ory Identities APIs come with the ability to specify custom UI URLs. To make
sure, Ory knows about your custom UI, specify the URLs of your application on
https://console.ory.sh/projects/current/ui.

### Initializing a new flow

Initializing a new flow is done by navigating the user's page to the initialize
flow URL. After creating a new flow object, Ory will return a redirect to the
flow UI URL and, in some cases, return anti-CSRF cookies.

```ts
export function init(params: QueryParams, flowType: FlowType) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default return to automatically if they're logged in already.
  return redirect(
    "http://localhost:4000" +
      "/self-service/" +
      flowType.toString() +
      "/browser?" +
      new URLSearchParams(params).toString(),
    RedirectType.replace,
  )
}
```

**FlowType** can be: `login`, `registration`, `recovery`, `verification`,
`settings` or `error`

To access & render the flow, on your flow page, you can use the `flow` query
parameter, that is included in the redirect. Use it to call the
[`getLoginFlow()`](https://www.ory.sh/docs/reference/api#tag/frontend/operation/getLoginFlow)
API.

**Full Example**:

````ts
export async function getOrCreateRegistrationFlow(
  params: QueryParams
): Promise<RegistrationFlow> {
  const onRestartFlow = () => init(params, FlowType.Registration);

  // If flow ID doesn't exist in params simply trigget the init function.
  if (!params.flow) {
    return onRestartFlow();
  }

  return await serverClientFrontend()
    // Passing the flow ID
    .getRegistrationFlowRaw({ id: flow })
    .then(res => res.value())
    .catch(
      // Ory Elements predefines the handleFlowError function to simplify error handling.
      // You can define what should happen in each of these callbacks
      handleFlowError({
        onValidationError,
        onRestartFlow,
        onRedirect,
      })
    );
    ```
````

As soon as we have our flow data we can render the `<Registration/>` component
from `@ory/elements-react` package.

```tsx
export default async function RegistrationPage({ searchParams }: PageProps) {
  const flow = await getOrCreateRegistrationFlow(searchParams)

  if (!flow) {
    return <div>Flow not found</div>
  }

  return (
    <Registration
      flow={flow}
      config={oryConfiguration}
      components={ComponentOverrides}
    />
  )
}
```

### Styling

To include the default styles, add the following import to your app. Make sure
it's included on all pages, that use Ory Elements.

```ts
import "@ory/elements-react/theme/styles.css"
```

### Theming

Most styling can be overwritten, by providing your own custom CSS variables:

```css
:root {
  /* To override the text color of the primary buttons */
  --button-primary-fg-default: #fffeee;
}
```

## Package development

To develop and use the package `npm link` is recommended. To run the package in
watch mode use

```
npx nx run @ory/elements-react:dev
```
