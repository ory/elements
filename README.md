<h1 align="center"><img src="https://raw.githubusercontent.com/ory/meta/master/static/banners/elements.png" alt="Ory Elements - A component library for login, registration and account pages."></h1>

# Ory Elements

Ory Elements is a component library that makes building login, registration and
account pages for Ory a breeze:

- Reduces time to add complex auth flows to your customer experience, including
  multi-factor authentication and account recovery.
- Customizable, themeable, and replaceable components.
- Works with the React ecosystem (Next.js, plain React).
- Dynamically adapts the user interface to your Ory identity schema, sign-in and
  flow configuration.

Ory Elements' comes with several packages:

- [`@ory/elements-react`](./packages/elements-react/README.md)
- [`@ory/nextjs`](./packages/nextjs/README.md)

> [!NOTE]  
> If you've used @ory/elements, @ory/elements-markup or @ory/elements-preact
> before, we recommend migrating to @ory/elements-react.

## Getting Started

Install Ory Elements into your existing React application. You can find example
apps [here](#example-apps)

> [!TIP]  
> Using Next.js? Skip [ahead](#nextjs)!

```shell
npm install @ory/elements-react react react-dom
```

To get started, add a login route to your application, and import the `Login`
from the `@ory/elements-react/theme` package:

```tsx
import { OryClientConfiguration } from "@ory/elements-react"
import { Login } from "@ory/elements-react/theme"

const baseConfig = {
  // Add
  project: {
    login_ui_url: "http://localhost:3000/auth/login",
    // additional project configuration
  }
} satisfies OryClientConfiguration

export default async function LoginPage() {
  const flow = // create or fetch a new login flow

  return (
    <Login
      flow={flow}
      config={config}
      components={{
        Card: {},
      }}
    />
  )
}
```

### Next.js

```shell
npm install @ory/nextjs
```

To use the middleware, add the following to `middleware.ts`:

```ts
import { createOryMiddleware } from "@ory/nextjs/middleware"

const oryConfig = {
  // Add your configuration
} satisfies

export const middleware = createOryMiddleware(oryConfig)

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths
export const config = {}
```

`@ory/nextjs` also comes with a few helpers to make working with the
self-service Ory flows easier:

```tsx
import { Login } from "@ory/elements-react/theme"
import { enhanceOryConfig } from "@ory/nextjs"
// or @ory/nextjs/pages if you're using the Next.js pages router
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import baseConfig from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const config = enhanceOryConfig(baseConfig)
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <Login
      flow={flow}
      config={config}
      components={{
        Card: {},
      }}
    />
  )
}
```

## Example Apps

Full examples are available in the `examples/` directory of this repository.

- [app router](https://github.com/ory/elements/tree/main/examples/nextjs-app-router)
- [pages router](https://github.com/ory/elements/tree/main/examples/nextjs-pages-router)

## Internalization (i18n)

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

## Understanding Ory Elements

### Bundling System

Ory Elements uses [nx](https://nx.dev/) as a task

### Overriding Styles

@ory/elements-react provides CSS variables, that can be used to override
specific elements or groups of elements in the UI. For more complex
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

### Component System

@ory/elements-react allows overriding many specific components with your own
implementation.

To provide your own implementation, pass the `components` prop to any of the
self-service flow components (`<Login />`, `<Registration />`, etc.).

`app/login/page.tsx`:

```tsx
import { Login } from "@ory/elements-react/theme"
import { MyCustomHeader } from "./my-custom-header"

export default async function LoginPage() {
  // Other setup variables
  return (
    <Login
      // other props
      components={{
        Card: {
          Header: MyCustomHeader,
        },
      }}
    />
  )
}
```

`my-custom-header.tsx`:

```tsx
"use client"

function MyCustomHeader() {
  return <div>My custom header</div>
}
```
