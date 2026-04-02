# Ory Elements + Matomo analytics example

This example demonstrates how to send analytics events from Ory Elements
authentication flows to a self-hosted Matomo instance using the
[Matomo HTTP Tracking API](https://developer.matomo.org/api-reference/tracking-api).

It is based on the [Next.js App Router example](../nextjs-app-router) and uses
the `onSuccess`, `onValidationError`, and `onError` event handler callbacks
available on every Ory Elements flow component.

## Prerequisites

- Docker and Docker Compose
- An [Ory Network](https://console.ory.sh/) project (or update `.env` to point
  at a local Kratos instance)

## Quick start

1. Start the stack:

   ```bash
   docker compose up
   ```

2. Open <http://localhost:8087> and complete the Matomo setup wizard:
   - Database server: `matomo-db`
   - Login: `matomo` / Password: `matomo` / Database: `matomo`
   - Note the **Site ID** (usually `1`) and update `NEXT_PUBLIC_MATOMO_SITE_ID`
     in `.env` if it differs.

3. Start the app on a local port

   ```bash
   npm run dev
   ```

4. Open the app at <http://localhost:3000> and use any authentication flow.

5. In Matomo, navigate to **Behaviour > Events** to see the tracked events.

## Tracked events

All events use the category `auth`.

| Flow         | Success action         | Validation error action         | Error action         |
| ------------ | ---------------------- | ------------------------------- | -------------------- |
| Login        | `login_success`        | `login_validation_error`        | `login_error`        |
| Registration | `registration_success` | `registration_validation_error` | `registration_error` |
| Recovery     | `recovery_success`     | `recovery_validation_error`     | `recovery_error`     |
| Verification | `verification_success` | `verification_validation_error` | `verification_error` |
| Settings     | `settings_success`     | `settings_validation_error`     | `settings_error`     |

The event **name** carries the method (for success events), flow ID (for
validation errors), or error type (for error events).

## How it works

The integration adds two files on top of the base example:

- **`lib/matomo.ts`** — A thin wrapper around Matomo's HTTP Tracking API that
  sends events via `fetch` with `mode: "no-cors"` (fire-and-forget). No
  additional npm dependencies required.

- **`components/ory-flow-with-matomo.tsx`** — A shared client component that
  wraps any Ory Elements flow component (`Login`, `Registration`, `Recovery`,
  `Verification`, `Settings`) and wires up `onSuccess`, `onValidationError`, and
  `onError` callbacks that call `trackEvent`.

Each flow page stays a server component that fetches the flow, then renders
`<OryFlowWithMatomo>` instead of the bare Ory theme component:

```tsx
import OryFlowWithMatomo from "@/components/ory-flow-with-matomo"

// In the page component:
return <OryFlowWithMatomo flowType="login" flow={flow} />
```

This pattern keeps server-side flow fetching intact while adding client-side
analytics with minimal changes to each page.
