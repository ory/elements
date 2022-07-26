## Elements

Ory component library for custom UI integration and development. A set of tools 

Here we are using [Vite](https://vitejs.dev/) as the bundler instead of only Rollup. This makes the bundling experience a bit easier and really fast! We can now support a variety of environments through a singular repository. For example, in this repository we already have React, Preact and HTML support. 

---

[Vanilla-Extract](https://vanilla-extract.style/) is used to strongly type the CSS, a type of `CSS-in-JS` library which generates a static CSS file for us when the library is built. This means we can manage our CSS and reduce a lot of typing, since it can generate the CSS classes for us.

Here is an example of vanilla-extract in action!

```ts
export const dividerStyle = recipe({
  base: {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    border: 0,
    borderTop: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.def,
    width: pxToRem(64)
  },
  variants: {
    sizes: {
      fullWidth: {
        width: '100%'
      }
    }
  }
});
```
Generated JS function.

```js
var dividerStyle = createRuntimeFn({ defaultClassName: "_3ldkmt0", variantClassNames: { sizes: { fullWidth: "_3ldkmt1" } }, defaultVariants: {}, compoundVariants: [] });
```

And the generated CSS classes.

```css
._3ldkmt0 {
  display:block;
  text-align:center;
  overflow:hidden;
  box-sizing:border-box;
  border:0;
  border-top:.25rem solid;
  border-color:var(--ory-theme-border-def);
  width:4rem
}

._3ldkmt1 {
  width:100%
}
```

---

Vanilla-Extract also provides us theme variables which we can give static names. This means we can overwrite them inside the project consuming the library!

```css
:root {
    --ory-theme-font-family: Inter;
    --ory-theme-font-style: normal;
    --ory-theme-accent-def: #3D53F5;
    --ory-theme-accent-muted: #6475F7;
    --ory-theme-accent-emphasis: #3142C4;
    --ory-theme-accent-disabled: #E0E0E0;
    --ory-theme-accent-subtle: #eceefe;
    --ory-theme-foreground-def: #171717;
    --ory-theme-foreground-muted: #616161;
    --ory-theme-foreground-subtle: #9E9E9E;
    --ory-theme-foreground-disabled: #BDBDBD;
    --ory-theme-foreground-on-dark: #FFFFFF;
    --ory-theme-foreground-on-accent: #FFFFFF;
    --ory-theme-foreground-on-disabled: #e0e0e0;
    --ory-theme-background-surface: #FFFFFF;
    --ory-theme-background-canvas: #FCFCFC;
    --ory-theme-error-def: #9c0f2e;
    --ory-theme-error-subtle: #fce8ec;
    --ory-theme-error-muted: #e95c7b;
    --ory-theme-error-emphasis: #DF1642;
    --ory-theme-success-emphasis: #18A957;
    --ory-theme-border-def: #E0E0E0;
    --ory-theme-text-def: #FFFFFF;
    --ory-theme-text-disabled: #757575;
    --ory-theme-input-background: #FFFFFF;
    --ory-theme-input-disabled: #E0E0E0;
    --ory-theme-input-placeholder: #9E9E9E;
    --ory-theme-input-text: #424242;
}
```

---

For ExpressJS the library also exports a helper function which registers all of the CSS the library produces.

```ts
import express, { Application } from 'express';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { oryTheme, Theme } from '../theme';

export const RegisterOryThemesExpress = (app: Application, theme: Theme) => {
  app.use('/theme.css', (req, res) => {
    res.header('Content-Type', 'text/css');
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...oryTheme,
        ...theme
      }).toString()}}`
    );
  });
  app.use('/', express.static('node_modules/@ory/themes/dist'));
};
```

Which exposes all of the relevant css files for us which we just import in our HTML page:

```html
  <link rel="stylesheet" href="style.css"> // the default theme variables
  <link rel="stylesheet" href="theme.css"> // the overidden theme variables
```

We can then reference a component through the handlebars helper functions that return pure HTML.

```handlebars
{{{card}}}

{{{typography
      "Welcome!"
      "headline37"
      "foregroundDefault"
 }}}
```

```ts
// Render the data using a view (e.g. Jade Template):
res.render('login', {
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
     children: Message({message: "Woah there", severity: "info"})
    })
})
```