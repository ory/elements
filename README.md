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

Ory Elements comes with several packages:

- [`@ory/elements-react`](./packages/elements-react/README.md)
- [`@ory/nextjs`](./packages/nextjs/README.md)

> [!NOTE]  
> If you've used @ory/elements, @ory/elements-markup or @ory/elements-preact
> before, we recommend migrating to @ory/elements-react. The legacy code base is
> in https://github.com/ory/elements-legacy.

If you're not looking to implement custom UI components for login, registration,
settings, verification, recovery, or consent, but rather want to integrate
authentication without changing the UI, follow our
[guide for Auth.js](https://www.ory.sh/docs/getting-started/integrate-auth/auth-js).

## Getting Started

### React

```shell
npm install @ory/elements-react react react-dom
```

For more information, see
[packages/elements-react](https://github.com/ory/elements/tree/main/packages/elements-react).

### Next.js

```shell
npm install @ory/nextjs
```

For more information, see
[packages/nextjs](https://github.com/ory/elements/tree/main/packages/nextjs).

## Example Apps

Full examples are available in the `examples/` directory of this repository.

- [app router](https://github.com/ory/elements/tree/main/examples/nextjs-app-router)
- [pages router](https://github.com/ory/elements/tree/main/examples/nextjs-pages-router)
