This is an example application using @ory/elements-react and TanStack Start.

## Getting started

1. Sign up for an account at https://console.ory.com
2. Create a new or use an existing project
3. Go to https://console.ory.com/projects/current/settings and copy the **API
   endpoints** URL
4. Set `ORY_SDK_URL` in the `.env` file to your project's **API endpoints** URL
5. Set `ORY_PROJECT_API_TOKEN` in a `.env.local` file to your project's **API
   token**. Git ignores `.env.local`, so the token stays out of commits. You can
   create an
   [API key in the Ory Console](https://www.ory.com/docs/concepts/personal-access-token).
6. Run `pnpm install --frozen-lockfile`
7. Run `pnpm run dev` and open http://localhost:3000

<!-- prettier-ignore-start -->
> [!WARNING]
> For convenience Ory provides a default "test" project, that
> can be used to interact with Ory's APIs. It is a public project, that can be
> used by anyone and data can be deleted at any time. Make sure to use a
> dedicated project.
<!-- prettier-ignore-end -->

`src/start.ts` registers the proxy from `@ory/tanstack-start/proxy`, so Ory runs
on http://localhost:3000 and its cookies are first-party. The proxy is for local
development and preview deployments. To use it on a preview deployment, add the
preview's origin to `trustedOrigins`, for example
`https://my-app-*-my-team.vercel.app`, and use a dedicated API key that is set
only in the preview environment.

The proxy isn't supported in production: through the proxy, Ory sees every
request coming from your server's address instead of your users' browsers. In
production, run Ory on a custom domain on the same site as the app and set
`ORY_SDK_URL` to it. The proxy can stay registered: on the same site, the app
uses `ORY_SDK_URL`.

## Features

- All self-service user flows Ory supports
  - [Login](http://localhost:3000/login)
  - [Registration](http://localhost:3000/registration)
  - [Recovery](http://localhost:3000/recovery)
  - [Verification](http://localhost:3000/verification)
  - [Settings](http://localhost:3000/settings)
- User logout

## Project structure

- `src/ory.functions.ts` - server functions that fetch flows, the session, and
  the logout flow
- `src/routes` - one route per flow, plus the home and error pages
- `src/start.ts` - registers the CSRF middleware for server functions and the
  proxy
- `tests` - run `pnpm run build && pnpm test` to check the built server and the
  dev server, with and without the proxy, against a mock Ory API

## Need help?

If you have any issues using this example, or Ory's products, reach out via the
[Ory Community Slack](https://slack.ory.com).
