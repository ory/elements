<h1 align="center"><img src="https://raw.githubusercontent.com/ory/meta/master/static/banners/elements.png" alt="Ory Elements - A component library for login, registration and account pages."></h1>

# Ory Elements

Ory Elements is a component library that makes building login, registration and
account pages for Ory a breeze:

- Reduces time to add complex auth flows to your customer experience, including
  multi-factor authentication and account recovery.
- Customizable, themeable, and replaceable components.
- Works with the React ecosystem (NextJS, React SPA).
- Dynamically adapts the user interface to your Ory identity schema, sign-in and
  flow configuration.

Ory Elements' comes with several packages:

- [`@ory/elements-react`](./packages/elements-react/README.md)
- [`@ory/nextjs`](./packages/nextjs/README.md)

Additionally, the v0 version of Ory Elements is in maintenance mode for
packages:

- [`@ory/elements-markup`](./packages/markup/README.md)
- [`@ory/elements-preact`](./packages/preact/README.md)
- [`@ory/elements-markup`](./packages/markup/README.md)

If you use one of the above packages, we recommend migrating to the new packages
ASAP.

## Getting Started

Install Ory Elements into your existing React / Preact or Express.js
application. You can find example apps [here](#example-apps)

**React**

```shell
npm install @ory/elements --save
```

**Preact**

```shell
npm install @ory/elements-preact --save
```

**Express.js**

```shell
npm install @ory/elements-markup --save
```

## Example Apps

Dive into Ory Elements with our `react` and `preact` SPA example applications,
located in the `examples/` directory.

To run the example application you will need a couple of things:

1. An [Ory Network (free) account](https://console.ory.sh/)
2. The [Ory CLI (tunnel)](https://www.ory.sh/docs/guides/cli/installation)

Clone this repository and set up the React example.

```shell
git clone git@github.com:ory/elements
npm install
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
have explicitly told our React app to use through the `VITE_ORY_SDK_URL` export.

Now you can see Ory Elements in action by opening <http://localhost:3000> in
your browser!

## Internalization (i18n)

Ory Elements supports translations out-of-the-box with the `IntlProvider`. The
`IntlProvider` is required by Ory Elements and maps American English as the
default language.

```tsx
import { ThemeProvider } from "@ory/elements"

const RootComponent = () => {
  return (
    <ThemeProvider>
      <IntlProvider>// children</IntlProvider>
    </ThemeProvider>
  )
}
```

To switch the language the UI should use, you can pass in the language code
through the `locale` prop.

```tsx
import { ThemeProvider } from "@ory/elements"

const RootComponent = () => {
  return (
    <ThemeProvider>
      <IntlProvider locale="nl" defaultLocale="en">
        // children
      </IntlProvider>
    </ThemeProvider>
  )
}
```

The `IntlProvider` has the ability to accept custom translations through a
`CustomLanguageFormats` type. You can specify to the `<IntlProvider>` that you
would like to use a `CustomTranslations` instead of the
`SupportedLanguages (default)` type which will require providing the
`customTranslations` prop.

More information on the Ory messages can be found
[in the docs](https://www.ory.sh/docs/kratos/concepts/ui-user-interface#ui-message-codes)

When providing a translation, you can merge an existing supported locale from
Ory Elements so that you do not need to provide all keys for the entire
tranlsation file :)

For example, I want to adjust the English translation to say `Email` instead of
`ID` when a Login card is shown. So I provide the key-value pair
`"identities.messages.1070004": "Email"`. Another unsupported language such as
`af` (Afrikaans) is also added only for one entry
`"identities.messages.1070004": "E-posadres"`. We merge the supported `en`
locale from Ory Elements so that we don't need to provide all key-value pairs.

```tsx
import {
  ThemeProvider,
  IntlProvider,
  CustomTranslations,
  locales,
} from "@ory/elements"

const RootComponent = () => {
  const myCustomTranslations: CustomLanguageFormats = {
    ...locales,
    en: {
      ...locales.en,
      "identities.messages.1070004": "Email",
    },
    af: {
      // fallback to English on other labels
      ...locales.en,
      "identities.messages.1070004": "E-posadres",
    },
  }

  return (
    <ThemeProvider>
      <IntlProvider<CustomTranslations>
        customTranslations={myCustomTranslations}
        locale="af"
        defaultLocale="en"
      >
        // children
      </IntlProvider>
    </ThemeProvider>
  )
}
```

It is of course also possible to provide the `IntlProvider` directly from the
[react-intl](https://formatjs.io/docs/react-intl/) library to format messages
and provide translations. The default translations of Ory Elements are located
in the `src/locales` directory.

```tsx
import { IntlProvider } from "react-intl"
import { locales } from "@ory/elements"

const customMessages = {
  ...locales,
  de: {
    ...locales.de,
    "login.title": "Login",
  },
}

const Main = () => {
  return (
    <IntlProvider locale={customMessageLocale} messages={customMessages}>
      <Router>
        <Route path="/" component={Dashboard} />
        {/* ... */}
      </Router>
    </IntlProvider>
  )
}
```

## End-to-end Testing with Playwright

Ory Elements provides an end-to-end library based on
[Playwright](https://playwright.dev/). This library can be used to test your
application's login, registration, recovery, verification and settings pages
with Ory Elements or with your own custom components.

It also provides a set of functions that can mock the Ory APIs and provide
fixtures mocking the Ory API responses. This is perfect for testing your
application's logic without having to run it against an Ory Network project,
making it really fast and easy to implement.

This is a great way for running on your CI/CD pipeline to catch any regressions
that may have been introduced.

Read more about the [Ory Elements E2E library](./packages/test/README.md).

## Breaking Changes

### v0.1.0-beta.1

All components have to be wrapped in a `<IntlProvider />` component. Either use
the default one from Ory Elements, or provide your custom messages through the
`<IntlProvider />` from `react-intl`.

### Before v0.0.1-beta.1

Before v0.0.1-beta.1, Ory Elements exposed a singular `style.css` file which
contained all the required fonts and icons necessary to work out of the box.
This was convenient for elements to work out of the box, but caused the bundle
size to be larger than necessary, especially for applications that only use a
few components or their own icons and fonts.

The new version of Ory Elements now only exposes the CSS for the components in
the `style.css` file, and the rest of the CSS are optional and can be imported
individually.

```tsx
// Ory Elements
// optional global css reset
import "@ory/elements/assets/normalize.css"
// optional fontawesome icons
import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"

// optional fonts
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"

// required styles for Ory Elements
import "@ory/elements/style.css"
```

## Quickstart: Storybook

Explore the Ory Elements via [Storybook](https://storybook.js.org/)!

Clone this repository and run:

```shell
npm run install
npm run build
# or `npm run build:clean` to ensure no packages have cached versions
npm run storybook
```

## Contributing

Write a new component inside the `src/react-components` directory with its
corresponding CSS in `src/theme`. Check it out by writing a new story for the
component in the `src/stories` folder.

Add a test to verify the component works correctly by creating a new file next
to the component file with the same name and an added `*.spec.ts` extension. All
E2E and component tests are written in [Playwright](https://playwright.dev/).

**Example Apps**

To contribute an example application, please add it to the `examples/` folder.
To ensure the example works correctly within the workspace build system, add the
`elements` package to the example `package.json` with an asterisk `*` as the
version.

Below is an example of how you should add the package.

```json
...
"devDependencies": {
"@ory/elements": "*"
}
...
```

### Default Translations

Ory Elements comes with default translations for a few language, like Spanish
and German. The language files are located in the `src/locales` directory. The
English messages are extracted from this codebase and merged with Kratos
messages. To update them, run `npm run generate-locales`. They need to be
updated every time new messages are added to Elements or Kratos. All other
languages are derived from the English messages. The `IntlProvider` from Ory
Elements loads the default translations.

## Understanding Ory Elements

### Bundling System

Ory Elements uses [nx](https://nx.dev/) to bundle each package in the Ory
Elements mono-repository.

Nx publishes the code to the public [npm registry](https://www.npmjs.com/).

### Strongly typed CSS using Vanilla-Extract

[Vanilla-Extract](https://vanilla-extract.style/) is used to strongly type the
CSS, a type of `CSS-in-JS` library which generates a static CSS file for us when
the library is built. This means we can manage our CSS and reduce a lot of
typing, since it can generate the CSS classes for us.

Here is an example of vanilla-extract in action!

```ts
export const dividerStyle = recipe({
  base: {
    display: "block",
    textAlign: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    border: 0,
    borderTop: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.def,
    width: pxToRem(64),
  },
  variants: {
    sizes: {
      fullWidth: {
        width: "100%",
      },
    },
  },
})
```

Generated JS function.

```js
var dividerStyle = createRuntimeFn({
  defaultClassName: "_3ldkmt0",
  variantClassNames: { sizes: { fullWidth: "_3ldkmt1" } },
  defaultVariants: {},
  compoundVariants: [],
})
```

And the CSS.

```css
gO .\_3ldkmt0 {
  display: block;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
  border: 0;
  border-top: 0.25rem solid;
  border-color: var(--ory-theme-border-def);
  width: 4rem;
}

.\_3ldkmt1 {
  width: 100%;
}
```

### Overriding Styles

Vanilla-Extract also provides us theme variables which we can give static names.
This means we can overwrite them inside the project consuming the library!

```css
:root {
  --ory-theme-font-family: Inter;
  --ory-theme-font-style: normal;
  --ory-theme-accent-def: #3d53f5;
  --ory-theme-accent-muted: #6475f7;
  --ory-theme-accent-emphasis: #3142c4;
  --ory-theme-accent-disabled: #e0e0e0;
  --ory-theme-accent-subtle: #eceefe;
  --ory-theme-foreground-def: #171717;
  --ory-theme-foreground-muted: #616161;
  --ory-theme-foreground-subtle: #9e9e9e;
  --ory-theme-foreground-disabled: #bdbdbd;
  --ory-theme-foreground-on-dark: #ffffff;
  --ory-theme-foreground-on-accent: #ffffff;
  --ory-theme-foreground-on-disabled: #e0e0e0;
  --ory-theme-background-surface: #ffffff;
  --ory-theme-background-canvas: #fcfcfc;
  --ory-theme-error-def: #9c0f2e;
  --ory-theme-error-subtle: #fce8ec;
  --ory-theme-error-muted: #e95c7b;
  --ory-theme-error-emphasis: #df1642;
  --ory-theme-success-emphasis: #18a957;
  --ory-theme-border-def: #e0e0e0;
  --ory-theme-text-def: #ffffff;
  --ory-theme-text-disabled: #757575;
  --ory-theme-input-background: #ffffff;
  --ory-theme-input-disabled: #e0e0e0;
  --ory-theme-input-placeholder: #9e9e9e;
  --ory-theme-input-text: #424242;
}
```

Inside our components we provide the `<ThemeProvider />` which exposes the
`themeOverrides` property so that you can implement your own theme.

```tsx
// Ory Elements
// optional global css reset
import "@ory/elements-preact/assets/normalize.css"
// optional fontawesome icons
import "@ory/elements-preact/assets/fa-brands.min.css"
import "@ory/elements-preact/assets/fa-solid.min.css"
import "@ory/elements-preact/assets/fontawesome.min.css"

// optional fonts
import "@ory/elements-preact/assets/inter-font.css"
import "@ory/elements-preact/assets/jetbrains-mono-font.css"

// required styles for Ory Elements
import "@ory/elements-preact/style.css"

const Main = () => {
  return (
    <ThemeProvider themeOverrides={customTheme}>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/verification" component={Verification} />
        <Route path="/recovery" component={Recovery} />
        <Route path="/settings" component={Settings} />
      </Router>
    </ThemeProvider>
  )
}
```

### Theme CSS in Express.js

For Express.js the library also exports a helper function which registers all
the CSS the library produces.

```ts
import express, { Application } from "express"
import { assignInlineVars } from "@vanilla-extract/dynamic"
import { oryTheme, Theme } from "../theme"

export const RegisterOryElementsExpress = (app: Application, theme: Theme) => {
  app.use("/theme.css", (req, res) => {
    res.header("Content-Type", "text/css")
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...oryTheme,
        ...theme,
      }).toString()}}`,
    )
  })
  app.use("/", express.static("node_modules/@ory/elements/dist"))
}
```

Which exposes all the relevant CSS files for us which we just import in our HTML
page:

```html
<link rel="stylesheet" href="style.css" /> // the default theme variables
<link rel="stylesheet" href="theme.css" /> // the overidden theme variables
```

### Rendering components

We can then reference a component through handlebars' helper functions that
return pure HTML.

```handlebars
{{{card}}}

{{{typography "Welcome!" "headline37" "foregroundDefault"}}}
```

```ts
// Render the data using a view (e.g. Jade Template):
res.render("login", {
  ...flow,
  typography: (text: string, size: any, color: any) =>
    Typography({
      children: text,
      type: "regular",
      size,
      color,
    }),
  card: UserAuthCard({
    title: !(flow.refresh || flow.requested_aal === "aal2")
      ? "Sign In"
      : "Two-Factor Authentication",
    flow: flow as SelfServiceFlow,
    flowType: "login",
    cardImage: "ory-logo.svg",
    additionalProps: {
      forgotPasswordURL: "recovery",
      signupURL: initRegistrationUrl,
      logoutURL: logoutUrl,
    },
  }),
})
```

---

### Component System

Ory Elements solely relies on React components since they are easy to write and
provides support to a large React based ecosystem. The project then bundles
these components to their respective needs. An example is bundling for Preact
which you can find in the
[packages](https://github.com/ory/elements/tree/main/packages)' folder. It uses
the React components directly in this case, but bundles it specifically for
Preact support.

Each component relies on some CSS styles, which are located in the
[theme](https://github.com/ory/elements/tree/main/src/theme) directory. To
understand how this works, please refer to the [CSS System](#css-system)

#### Express.js systems

Express.js is an edge-case which requires the React components to be wrapped by
the `ReactDOMServer` to produce static HTML. This essentially does server-side
rendering of the components and removes any client-side JavaScript. Each
component needs to be wrapped by `ComponentWrapper` which essentially uses
`ReactDOMServer`. The `elements-markup` package then bundles the React library
with it so that the React code lives with the component library. The exported
function takes the component props and context. The context is used for context
providers, such as the `IntlProvider` from `react-intl`.

Here is an example of exporting the `UserAuthCard`.

```ts
import {
  UserAuthCard as userAuthCard,
  UserAuthCardProps,
} from "../react-components"
import { ComponentWrapper, Context } from "./component-wrapper"

export const UserAuthCard = (
  props: UserAuthCardProps,
  context: Context = {},
) => {
  return ComponentWrapper(userAuthCard, props, context)
}

export type { UserAuthCardProps } from "../react-components"
```

### Asset System

Assets are bundled into a singular `style.css` file under each packages' `dist/`
folder. Anything placed inside the
[assets](https://github.com/ory/elements/tree/main/src/assets) folder will be
bundled. They can also be directly imported by the React components to be used
and are sometimes required by a component. An example is the
[Social Button Component](https://github.com/ory/elements/blob/main/src/react-components/button-social.tsx#L11-L13).

## Versioning and Publishing

Ory Elements uses a fully automatic release publishing pipeline. All that is
necessary is to create a new release on GitHub, after which the workflow runs
all the necessary steps to release the modules to the NPM registry.

## Using local Ory SDKs

Most of the time, new features to this repository need some work in the
corresponding Ory products to work. To make the development cycle more
productive, it's possible to generate the SDK from a local OpenAPI / Swagger
spec file.

```bash
export KRATOS_DIR=/path/to/kratos # point this variable to the root of your local Kratos clone

make build-sdk
```

This copies the current OpenAPI spec from the local Kratos repository to the
current Elements directory (`./contrib/sdk/api.json`).

After that, it generates the Typescript SDK according to the spec and copies it
to the `node_modules` directory. This overrides the currently installed module!

Now you can use the updated SDK without publishing to NPM first.

## Testing `@ory/elements` changes locally

To test local changes in `@ory/elements` in a local Ory examples repository, you
can point NPM to use a local directory instead of a remote package from the
registry.

This requires to first build `@ory/elements`:

```bash
# In your cloned elements directory
npm run build # or more specialized `npm run build:react, etc.`
```

Make sure, that the build passed without errors!

After that, you can set the path to elements in the `package.json` of your
project:

```shell
npm i /path/to/elements/packages/markup

# or for preact
# npm i /path/to/elements/packages/preact

# or for react
# npm i /path/to/elements/packages/react
```

Make sure to not commit these changes, as they will break on CI or on other
machines that have a different setup.
