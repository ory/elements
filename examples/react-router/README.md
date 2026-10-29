This is an example application using `@ory/elements-react` and
`@ory/react-router` with React Router in framework mode.

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
7. Run `pnpm run dev` and open http://localhost:5173

<!-- prettier-ignore-start -->
> [!WARNING]
> For convenience Ory provides a default "test" project, that
> can be used to interact with Ory's APIs. It is a public project, that can be
> used by anyone and data can be deleted at any time. Make sure to use a
> dedicated project.
<!-- prettier-ignore-end -->

The proxy route in `app/routes/ory-proxy.ts` serves the Ory APIs on
`http://localhost:5173`. The proxy is for local development and preview
deployments: add your preview origins to `trustedOrigins`, and use a dedicated
API key for previews. It isn't supported in production, because through the
proxy Ory sees your server instead of your users as the client. In production,
use a custom domain on Ory Network, or your own domain with Ory Enterprise
License, on the same site as your application, and set `ORY_SDK_URL` to it.

## Features

- All self-service user flows Ory supports
  - [Login](http://localhost:5173/auth/login)
  - [Registration](http://localhost:5173/auth/registration)
  - [Recovery](http://localhost:5173/auth/recovery)
  - [Verification](http://localhost:5173/auth/verification)
  - [Settings](http://localhost:5173/settings)
- User logout

## Project structure

- `app/routes.ts` - the route configuration, including the Ory proxy routes
- `app/routes` - the route modules for the flows, the error page, and the home
  page
- `app/ory.config.ts` - the Ory Elements configuration

## Need help?

If you have any issues using this example, or Ory's products, don't hesitate to
reach out via the [Ory Community Slack](https://slack.ory.com).
