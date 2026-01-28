# `@ory/nextjs`

This package contains the Next.js SDK for Ory. It provides a set of React
components, server-side components, and hooks to interact with the Ory
ecosystem. Supports both app and page routers.

> [!NOTE]  
> This package's primary use case is for developing custom components for login,
> registration, verification, settings, recovery, or consent. For integrating
> authentication without changing the UI, follow our
> [guide for Auth.js](https://www.ory.com/docs/getting-started/integrate-auth/auth-js).

## Use case

This package includes a middleware for the app and page router that enables
local development and preview environments to work with
[Ory's cookie security model](https://www.ory.com/docs/security-model). When
using the `@ory/nextjs` middleware, Ory Tunnel is not needed for development.

Check the
[app router](https://github.com/ory/elements/blob/main/examples/nextjs-app-router/middleware.ts)
and
[page router](https://github.com/ory/elements/blob/main/examples/nextjs-pages-router/middleware.ts)
middleware example for more details.

## Installation

Run `npm install @ory/nextjs` or `yarn add @ory/nextjs` to install the package.

## Configuration

This middleware expects environment variable `NEXT_PUBLIC_ORY_SDK_URL` to be set
to your Ory Network Project SDK URL. This is the URL that you would use to
access the Ory API. If you have a custom domain for your Ory Network Project,
you should use the custom domain for `NEXT_PUBLIC_ORY_SDK_URL`.

## Learn by example

See the [examples](https://github.com/ory/elements/blob/main/examples) directory
for examples on how to use the package.

## Development

This package is built using Nx.

### Building

Run `nx build @ory/nextjs` to build the library.

### Developing

Run `nx dev @ory/nextjs` to watch the source code for changes and continuously
build the library.

### Running unit tests

Run `nx test @ory/nextjs` to execute the unit tests via
[Jest](https://jestjs.io).
