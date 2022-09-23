## Elements

Ory component library for custom UI integration and development. A set of tools

Here we are using [Vite](https://vitejs.dev/) as the bundler instead of only
Rollup. This makes the bundling experience a bit easier and really fast! We can
now support a variety of environments through a singular repository. For
example, in this repository we already have React, Preact and HTML support.

---

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

And the generated CSS classes.

```css
._3ldkmt0 {
  display: block;
  text-align: center;
  overflow: hidden;
  box-sizing: border-box;
  border: 0;
  border-top: 0.25rem solid;
  border-color: var(--ory-theme-border-def);
  width: 4rem;
}

._3ldkmt1 {
  width: 100%;
}
```

---

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

---

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

We can then reference a component through the handlebars helper functions that
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
  card: Card({
    title: "Login With Ory",
    children: Message({ message: "Woah there", severity: "info" }),
  }),
})
```

---

### Example Apps

Ory Elements also has example applications which we test the component library
against.

Currently we have a `react` and `preact` SPA under the `tests/` directory.

To run the example application you will need a couple things:

1. An [Ory Cloud (free) account](https://console.ory.sh/)
2. The [Ory CLI (tunnel)](https://www.ory.sh/docs/guides/cli/installation)

Clone this repository and setup the React example.

```shell
git clone git@github.com:ory/elements
npm i
npm run initialize
npm run build:clean
cd tests/react-spa
export VITE_ORY_SDK_URL=http://localhost:4000
npm run dev -- --port 3000
```

Now run the Ory CLI tunnel.

```shell
ory tunnel http://localhost:3000 --project <project-slug> --dev
```

The tunnel will now _mirror_ the Ory APIs under `http://localhost:4000` which we
have explicity told our React app to use through the `VITE_ORY_SDK_URL` export.

Open http://localhost:3000 in your browser and everything will work out of the
box :)
