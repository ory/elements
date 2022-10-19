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

## Getting Started

Install Ory Elements into your existing React / Preact or ExpressJS application.
You can find example apps [here](#example-apps)

**React**

```shell
npm install @ory/elements --save
```

**Preact**

```shell
npm install @ory/elements-preact --save
```

**ExpressJs**

```shell
npm install @ory/elements-markup --save
```

## Example Apps

Dive into Ory Elements with our `react` and `preact` SPA example applications,
located in the `examples/` directory.

To run the example application you will need a couple things:

1. An [Ory Network (free) account](https://console.ory.sh/)
2. The [Ory CLI (tunnel)](https://www.ory.sh/docs/guides/cli/installation)

Clone this repository and setup the React example.

```shell
git clone git@github.com:ory/elements
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

Now you can see Ory Elements in action by opening http://localhost:3000 in your
browser!

## Quickstart: Storybook

Explore the Ory Elements via [Storybook](https://storybook.js.org/)!

Clone this repository and run:

```shell
npm run initialize
npm run build
# or `npm run build:clean` to ensure no packages have cached versions
npm run storybook
```

## Contributing

Write a new component inside the `src/react-components` directory with its
corresponding css in `src/theme`. Check it out by writing a new story for the
component in the `src/stories` folder.

Add a test to verify the component works correctly by creating a new file next
to the component file with the same name and an added `*.spec.ts` extension. All
E2E and component tests are written in [Playwright](https://playwright.dev/).

**Example Apps**

To contribute an example application, please add it to the `examples/` folder.
To ensure the example works correctly within the Lerna build system, add the
`elements` package to the example `package.json` with an asterisk `*` as the
version.

Below is an example of how you should add the pacakge.

```json
...
"devDependencies": {
  "@ory/elements": "*"
}
...
```

## Understanding Ory Elements

### Bundling System

Ory Elements uses [Lerna](https://lerna.js.org/) to bundle each package in the
Ory Elements mono-repository. This also helps with package management and build
caching. Lerna also publishes the code to the public
[npm registry](https://www.npmjs.com/) for us.

Lerna also use [Nx](https://nx.dev/) to build the packages in parallel.

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

And the gO .\_3ldkmt0 { display: block; text-align: center; overflow: hidden;
box-sizing: border-box; border: 0; border-top: 0.25rem solid; border-color:
var(--ory-theme-border-def); width: 4rem; }

.\_3ldkmt1 { width: 100%; }

````

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
````

Inside of our components we provide the `<ThemeProvider />` which exposes the
`themeOverrides` property so that you can implement your own theme.

```tsx
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

### Theme CSS in ExpressJS

For ExpressJS the library also exports a helper function which registers all of
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

Which exposes all of the relevant css files for us which we just import in our
HTML page:

```html
<link rel="stylesheet" href="style.css" /> // the default theme variables
<link rel="stylesheet" href="theme.css" /> // the overidden theme variables
```

### Rendering components

We can then reference a component through handlebars helper functions that
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
[packages](https://github.com/ory/elements/tree/main/packages) folder. It uses
the React components directly in this case but bundles it specifically for
Preact support.

Each component relies on some CSS styles, which are located in the
[theme](https://github.com/ory/elements/tree/main/src/theme) directory. To
understand how this works, please refer to the [CSS System](#css-system)

#### Express JS systems

Express JS is an edge-case which requires the React components to be wrapped by
the `ReactDOMServer` to produce static HTML. This essentially does server-side
rendering of the components and removes any client-side JavaScript. Each
component needs to be wrapped by `ComponentWrapper` which essentially uses
`ReactDOMServer`. The `elements-markup` package then bundles the React library
with it so that the React code lives with the component library.

Here is an example of exporting the `UserAuthCard`.

```ts
import {
  UserAuthCard as userAuthCard,
  UserAuthCardProps,
} from "../react-components"

export const UserAuthCard = (props: UserAuthCardProps) => {
  return ComponentWrapper(userAuthCard(props))
}

export type { UserAuthCardProps } from "../react-components"
```

### Asset System

Assets are bundled into a singular `style.css` file under each packages `dist/`
folder. Anything placed inside the
[assets](https://github.com/ory/elements/tree/main/src/assets) folder will be
bundled. They can also be directly imported by the React components to be used
and are sometimes required by a component. An example is the
[Social Button Component](https://github.com/ory/elements/blob/main/src/react-components/button-social.tsx#L11-L13).

## Versioning and Publishing

Ory Elements uses a mixture of manual and automated publishing. We first need to
bump all of the package versions inside of the repository using `lerna version`
and then we need to create a GitHub release which will trigger a CI action to
build and publish the packages to npm.

Steps:

1. npm run version
2. push to github
3. create github release
