<p align="center">
    <a href="https://ory.sh">
        <img src="https://raw.githubusercontent.com/ory/meta/refs/heads/master/static/logos/logo-ory.svg" height="72" />
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
- **`@ory/client-fetch`**

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
[`getRegistrationFlowRaw()`](https://www.ory.sh/docs/reference/api#tag/frontend/operation/getRegistrationFlow)
API.

**Full Example**:

```ts
import {
  Configuration,
  FlowType,
  FrontendApi,
  handleFlowError,
  RegistrationFlow,
} from "@ory/client-fetch"
import { redirect, RedirectType } from "next/navigation"

type QueryParams = {
  flow?: string
}
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

export async function getOrCreateRegistrationFlow(params: {
  flow?: string
}): Promise<RegistrationFlow> {
  const onRestartFlow = () => init(params, FlowType.Registration)

  // If flow ID doesn't exist in params simply trigger the init function.
  if (!params.flow) {
    return onRestartFlow()
  }

  return await serverClientFrontend()
    // Pass in the flow ID
    .getRegistrationFlowRaw({ id: params.flow })
    .then((res) => res.value())
    .catch(
      // @ory/client-fetch predefines the handleFlowError function to simplify error handling.
      // You can define what should happen in each of these callbacks
      handleFlowError({
        // Validation errors happen if the user's provided input failed a validation rule (e.g. not an email, etc.)
        onValidationError,
        // Flows can sometimes encounter unrecoverable errors, in that case we need to start a new flow to protect the user.
        // In most cases, it is enough to initialize a new flow.
        onRestartFlow,
        // Sometimes a flow requires a redirect to a different URL/context. For example during OIDC flows.
        // In that case, you can handle the redirect here, for example using your framework's preferred method for redirects.
        onRedirect,
      }),
    )
}

function onValidationError(flow: RegistrationFlow) {
  // handle validation error
}

function onRedirect(url: string, external: boolean) {
  // handle the redirect
}
```

As soon as we have our flow data we can render the `<Registration/>` component
from `@ory/elements-react` package.

```tsx
import { Registration } from "@ory/elements-react/theme"

export default async function RegistrationPage({ searchParams }: PageProps) {
  const flow = await getOrCreateRegistrationFlow(searchParams)

  if (!flow) {
    return <div>Flow not found</div>
  }

  return <Registration flow={flow} config={oryConfiguration} />
}
```

### Styling

To include the default styles, add the following import to your app. Make sure
it's included on all pages, that use Ory Elements.

```ts
import "@ory/elements-react/theme/styles.css"
```

### Theming

The styling for specific elements or groups of elements in the UI can be
overwritten by providing your own custom CSS variables. For more complex
customizations see the [Component System](#component-system).

```css
:root {
  /* primitives */
  /* Overriding these may affect more variables "down stream" */
  --ui-100: #f1f5f9;
  --ui-200: #e2e8f0;
  --ui-300: #cbd5e1;
  --ui-400: #94a3b8;
  --ui-50: #f8fafc;
  --ui-500: #64748b;
  --ui-600: #475569;
  --ui-700: #334155;
  --ui-800: #1e293b;
  --ui-900: #0f172a;
  --ui-950: #020617;
  --ui-black: #000000;
  --ui-danger: #dc2626;
  --ui-success: #22c55e;
  --ui-transparent: #ffffff00;
  --ui-warning: #eab308;
  --ui-white: #ffffff;
  /* primitives end */

  /* brand */
  --brand-100: var(--ui-100);
  --brand-200: var(--ui-300);
  --brand-300: var(--ui-500);
  --brand-400: var(--ui-700);
  --brand-50: var(--ui-50);
  --brand-500: var(--ui-900);
  --brand-600: var(--ui-white);
  --brand-700: var(--ui-200);
  --brand-800: var(--ui-400);
  --brand-900: var(--ui-600);
  --brand-950: var(--ui-800);
  /* brand end */

  /* interface */
  /* These variables affect "groups" of variables, and are re-used in the more specific variables below */
  --interface-background-brand-primary: var(--brand-500);
  --interface-background-brand-primary-hover: var(--brand-400);
  --interface-background-brand-secondary: var(--brand-50);
  --interface-background-brand-secondary-hover: var(--brand-100);
  --interface-background-default-inverted: var(--ui-900);
  --interface-background-default-inverted-hover: var(--ui-800);
  --interface-background-default-none: var(--ui-transparent);
  --interface-background-default-primary: var(--ui-white);
  --interface-background-default-primary-hover: var(--ui-50);
  --interface-background-default-secondary: var(--ui-50);
  --interface-background-default-secondary-hover: var(--ui-200);
  --interface-background-default-tertiary: var(--ui-200);
  --interface-background-default-tertiary-hover: var(--ui-300);
  --interface-background-disabled-disabled: var(--ui-200);
  --interface-background-validation-danger: var(--ui-danger);
  --interface-background-validation-success: var(--ui-success);
  --interface-background-validation-warning: var(--ui-warning);
  --interface-border-brand-brand: var(--brand-500);
  --interface-border-default-inverted: var(--ui-700);
  --interface-border-default-none: var(--ui-transparent);
  --interface-border-default-primary: var(--ui-300);
  --interface-border-disabled-disabled: var(--ui-300);
  --interface-border-validation-danger: var(--ui-danger);
  --interface-border-validation-success: var(--ui-success);
  --interface-border-validation-warning: var(--ui-warning);
  --interface-foreground-brand-on-primary: var(--brand-50);
  --interface-foreground-brand-on-secondary: var(--brand-950);
  --interface-foreground-brand-primary: var(--brand-500);
  --interface-foreground-brand-secondary: var(--brand-50);
  --interface-foreground-default-inverted: var(--ui-white);
  --interface-foreground-default-primary: var(--ui-900);
  --interface-foreground-default-secondary: var(--ui-700);
  --interface-foreground-default-tertiary: var(--ui-500);
  --interface-foreground-disabled-disabled: var(--ui-300);
  --interface-foreground-disabled-on-disabled: var(--ui-400);
  --interface-foreground-validation-danger: var(--ui-danger);
  --interface-foreground-validation-success: var(--ui-success);
  --interface-foreground-validation-warning: var(--ui-warning);
  /* interface end */

  /* Specific elements */
  --button-identifier-background-default: var(
    --interface-background-brand-secondary
  );
  --button-identifier-background-hover: var(
    --interface-background-brand-secondary-hover
  );
  --button-identifier-border-border-default: var(
    --interface-border-brand-brand
  );
  --button-identifier-border-border-hover: var(--interface-border-brand-brand);
  --button-identifier-foreground-default: var(
    --interface-foreground-brand-on-secondary
  );
  --button-identifier-foreground-hover: var(
    --interface-foreground-brand-on-secondary
  );
  --button-link-brand-brand: var(--interface-foreground-brand-primary);
  --button-link-brand-brand-hover: var(--interface-foreground-default-primary);
  --button-link-default-primary: var(--interface-foreground-default-primary);
  --button-link-default-primary-hover: var(
    --interface-foreground-brand-primary
  );
  --button-link-default-secondary: var(
    --interface-foreground-default-secondary
  );
  --button-link-default-secondary-hover: var(
    --interface-foreground-default-tertiary
  );
  --button-link-disabled-disabled: var(
    --interface-foreground-disabled-disabled
  );
  --button-primary-background-default: var(
    --interface-background-brand-primary
  );
  --button-primary-background-disabled: var(
    --interface-background-disabled-disabled
  );
  --button-primary-background-hover: var(
    --interface-background-brand-primary-hover
  );
  --button-primary-border-default: var(--interface-border-default-none);
  --button-primary-border-disabled: var(--interface-border-disabled-disabled);
  --button-primary-border-hover: var(--interface-border-default-none);
  --button-primary-foreground-default: var(
    --interface-foreground-brand-on-primary
  );
  --button-primary-foreground-disabled: var(
    --interface-foreground-disabled-on-disabled
  );
  --button-primary-foreground-hover: var(
    --interface-foreground-brand-on-primary
  );
  --button-secondary-background-default: var(
    --interface-background-default-primary
  );
  --button-secondary-background-disabled: var(
    --interface-background-disabled-disabled
  );
  --button-secondary-background-hover: var(
    --interface-background-default-primary-hover
  );
  --button-secondary-border-default: var(--interface-border-default-primary);
  --button-secondary-border-disabled: var(--interface-border-disabled-disabled);
  --button-secondary-border-hover: var(--interface-border-default-primary);
  --button-secondary-foreground-default: var(
    --interface-foreground-default-primary
  );
  --button-secondary-foreground-disabled: var(
    --interface-foreground-disabled-on-disabled
  );
  --button-secondary-foreground-hover: var(
    --interface-foreground-default-secondary
  );
  --button-social-background-default: var(
    --interface-background-default-primary
  );
  --button-social-background-disabled: var(
    --interface-background-disabled-disabled
  );
  --button-social-background-generic-provider: var(
    --interface-background-default-inverted
  );
  --button-social-background-hover: var(
    --interface-background-default-primary-hover
  );
  --button-social-border-default: var(--interface-border-default-primary);
  --button-social-border-disabled: var(--interface-border-disabled-disabled);
  --button-social-border-generic-provider: var(--interface-border-default-none);
  --button-social-border-hover: var(--interface-border-default-primary);
  --button-social-foreground-default: var(
    --interface-foreground-default-primary
  );
  --button-social-foreground-disabled: var(
    --interface-foreground-disabled-on-disabled
  );
  --button-social-foreground-generic-provider: var(
    --interface-foreground-default-inverted
  );
  --button-social-foreground-hover: var(
    --interface-foreground-default-secondary
  );
  --checkbox-background-checked: var(--interface-background-brand-primary);
  --checkbox-background-default: var(--interface-background-default-secondary);
  --checkbox-border-checkbox-border-checked: var(
    --interface-border-brand-brand
  );
  --checkbox-border-checkbox-border-default: var(
    --interface-border-default-primary
  );
  --checkbox-foreground-checked: var(--interface-foreground-brand-on-primary);
  --checkbox-foreground-default: var(--interface-foreground-default-primary);
  --form-background-default: var(--interface-background-default-primary);
  --form-border-default: var(--interface-border-default-primary);
  --input-background-default: var(--interface-background-default-primary);
  --input-background-disabled: var(--interface-background-disabled-disabled);
  --input-background-hover: var(--interface-background-default-primary-hover);
  --input-border-default: var(--interface-border-default-primary);
  --input-border-disabled: var(--interface-border-disabled-disabled);
  --input-border-focus: var(--interface-border-brand-brand);
  --input-border-hover: var(--interface-border-default-primary);
  --input-foreground-disabled: var(--interface-foreground-disabled-on-disabled);
  --input-foreground-primary: var(--interface-foreground-default-primary);
  --input-foreground-secondary: var(--interface-foreground-default-secondary);
  --input-foreground-tertiary: var(--interface-foreground-default-tertiary);
  --ory-background-default: var(--interface-background-default-primary);
  --ory-border-default: var(--interface-border-default-primary);
  --ory-foreground-default: var(--interface-foreground-default-primary);
  --radio-background-checked: var(--interface-background-brand-primary);
  --radio-background-default: var(--interface-background-default-secondary);
  --radio-border-checked: var(--interface-border-brand-brand);
  --radio-border-default: var(--interface-border-default-primary);
  --radio-foreground-checked: var(--interface-foreground-brand-on-primary);
  --radio-foreground-default: var(--interface-foreground-default-primary);
  --toggle-background-checked: var(--interface-background-brand-primary);
  --toggle-background-default: var(--interface-background-default-secondary);
  --toggle-border-checked: var(--interface-border-default-none);
  --toggle-border-default: var(--interface-border-default-primary);
  --toggle-foreground-checked: var(--interface-foreground-brand-on-primary);
  --toggle-foreground-default: var(--interface-foreground-brand-primary);
  /* Specific elements end */

  /* border radius */
  --border-radius-buttons: 0.25rem;
  --border-radius-forms: 0.25rem;
  --border-radius-general: 0.25rem;
  --border-radius-branding: 0.5rem;
  --border-radius-cards: 0.75rem;
  --border-radius-identifier: 62.4375rem;
  /* border radius end*/
}
```

### Component system

Many components in Ory Elements can be overriden with your own implementation.
Ory Elements also provides useful hooks that be used inside of your custom
components to get access to the library configuration, or the current flow.

**Example:**

```tsx
import { Registration } from "@ory/elements-react/theme"

function CustomCardHeader() {
  const { flowType } = useOryFlow()

  return <div>My Custom {flowType} Card header</div>
}

export default async function RegistrationPage({ searchParams }: PageProps) {
  const flow = await getOrCreateRegistrationFlow(searchParams)

  if (!flow) {
    return <div>Flow not found</div>
  }

  return (
    <Registration
      flow={flow}
      config={oryConfiguration}
      components={{
        Card: {
          CardHeader: CustomCardHeader,
        },
      }}
    />
  )
}
```

### internationalization (i18n)

`@ory/elements-react` comes with default translations for many languages.
Additionally, it provides a way to override the default messages, through the
`locale` property of the `OryClientConfiguration`.

```ts
const config = {
  intl: {
    locale: "en", // Or any of the other supported locales.
    customTranslations: {
      en: {
        "identities.messages.1040006": "This is a custom translation",
      },
    },
  },
}
```

For a full list of messages, see
[en.json](https://github.com/ory/elements/blob/main/packages/elements-react/src/locales/en.json).

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md).
