This is a simple example application using @ory/elements-react & Next.js app
router.

## Getting started

1. Sign up for an account at https://console.ory.sh
2. Create a new or use an existing project
3. Go to https://console.ory.sh/projects/current/settings and copy the **API
   endpoints** URL
4. Set the `NEXT_PUBLIC_ORY_SDK_URL` to your project's **API endpoints** URL
5. Run `npm install`
6. Run `npm run dev` and open navigate to http://localhost:3000

<!-- prettier-ignore-start -->
> [!WARNING]
> For convenience Ory provides a default "playground" project, that
> can be used to interact with Ory's APIs. It is a public project, that can be
> used by anyone and data can be deleted at any time. Make sure to use a
> dedicated project.
<!-- prettier-ignore-end -->

## Features

- All self-service user flows Ory supports
  - [Login](http://localhost:3000/auth/login)
  - [Registration](http://localhost:3000/auth/registration)
  - [Recovery](http://localhost:3000/auth/recovery)
  - [Verification](http://localhost:3000/auth/verification)
  - [Settings](http://localhost:3000/settings)
- User Logout

## Project structure

The project files reside in the `app/` directory:

- `app/auth` - contains the page files for the user auth flows
- `app/settings` - contains the page file for the settings flow
- `app` - contains the root page file and layout.

## Need help?

If you have any issues using this examples, or Ory's products, don't hesitate to
reach out via the [Ory Community Slack](https://slack.ory.sh).

## Run against local Ory Network instance

This section is relevant to Ory engineers only. When running a local Ory Network
instance, you will need to disable TLS verification and set the
`NEXT_PUBLIC_ORY_SDK_URL` to `https://<slug>.projects.oryapis:8080`:

```sh
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
```
