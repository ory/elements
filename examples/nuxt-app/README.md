# Ory Nuxt Example

This example demonstrates how to integrate Ory authentication flows with a Nuxt 4 application using `@ory/nuxt` and `@ory/elements-vue`.

## Project Structure

```
examples/nuxt-app/
├── assets/css/main.css    # Tailwind CSS 4 configuration with Ory theme
├── layouts/
│   ├── auth.vue           # Centered layout for auth pages
│   └── default.vue        # Default application layout
├── pages/
│   ├── login.vue          # Login flow
│   ├── registration.vue   # Registration flow
│   ├── recovery.vue       # Account recovery flow
│   ├── verification.vue   # Email verification flow
│   ├── settings.vue       # Protected settings page
│   ├── session.vue        # Session details page
│   ├── error.vue          # Error display page
│   └── index.vue          # Home page with session status
└── nuxt.config.ts         # Nuxt & Ory module configuration
```

## Configuration

### Nuxt Config (`nuxt.config.ts`)

The `@ory/nuxt` module is configured with project settings:

```typescript
export default defineNuxtConfig({
  modules: ["@ory/nuxt"],

  ory: {
    project: {
      // Localization
      default_locale: "en",
      locale_behavior: "force_default",

      // Branding
      name: "Ory Nuxt Example",

      // Feature flags
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,

      // UI URLs (must match your pages)
      login_ui_url: "/login",
      registration_ui_url: "/registration",
      verification_ui_url: "/verification",
      recovery_ui_url: "/recovery",
      settings_ui_url: "/settings",
      error_ui_url: "/error",
      default_redirect_url: "/",
    },
  },

  runtimeConfig: {
    public: {
      ory: {
        sdkUrl: process.env.NUXT_PUBLIC_ORY_SDK_URL || "",
      },
    },
  },
})
```

### Environment Variables

Create a `.env` file:

```bash
NUXT_PUBLIC_ORY_SDK_URL=https://your-project.projects.oryapis.com
```

## Styling with Tailwind CSS 4

This example uses Tailwind CSS 4 with the Vite plugin.

### Setup (`nuxt.config.ts`)

```typescript
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },
})
```

### Theme Configuration (`assets/css/main.css`)

```css
@import "@ory/elements-vue/theme/default/styles.css";

/* Include @ory/elements-vue components for Tailwind class scanning */
@source "../../../../packages/elements-vue/dist/**/*.{js,mjs}";

/* Base styles */
body {
  font-family: Inter, Helvetica, sans-serif;
  background-color: var(--ui-100);
  color: var(--ory-foreground-default);
}
```

The `@import` imports the default Ory theme styles, while `@source` tells Tailwind to scan the Ory elements package for class names used in components.

## Using Ory Components

### Auth Pages

Import the flow component and use the corresponding composable (e.g., `pages/login.vue`):

```vue
<script setup lang="ts">
import { Login } from "@ory/elements-vue"

definePageMeta({
  layout: "auth",
})

const config = useOryConfig()
const flow = await useOryLoginFlow()
</script>

<template>
  <Login v-if="flow" :flow="flow" :config="config" />
</template>
```

Available components:
- `Login` - Login flow with `useOryLoginFlow()`
- `Registration` - Registration flow with `useOryRegistrationFlow()`
- `Recovery` - Account recovery with `useOryRecoveryFlow()`
- `Verification` - Email verification with `useOryVerificationFlow()`
- `Settings` - Account settings with `useOrySettingsFlow()`

### Session Management

Check authentication status with `useAsyncOrySession()`:

```vue
<script setup lang="ts">
const { data: session } = await useAsyncOrySession()
</script>

<template>
  <div v-if="session">
    Welcome back! Session ID: {{ session.id }}
  </div>
  <div v-else>
    <NuxtLink to="/login">Login</NuxtLink>
  </div>
</template>
```

## Protected Routes

Use the `auth` middleware to protect pages:

```vue
<script setup lang="ts">
definePageMeta({
  middleware: "auth",
})
</script>
```

This redirects unauthenticated users to the login page.

## Available Composables

| Composable | Description |
|------------|-------------|
| `useOryConfig()` | Access Ory project configuration |
| `useOryLoginFlow()` | Initialize or retrieve login flow |
| `useOryRegistrationFlow()` | Initialize or retrieve registration flow |
| `useOryRecoveryFlow()` | Initialize or retrieve recovery flow |
| `useOryVerificationFlow()` | Initialize or retrieve verification flow |
| `useOrySettingsFlow()` | Initialize or retrieve settings flow |
| `useAsyncOrySession()` | Get current session (async) |

## Running the Example

```bash
# From the repository root
npm install

# Build dependencies
npm run build --workspace=@ory/elements-vue --workspace=@ory/nuxt

# (Optional) Generate Nuxt types for IDE support
npm run prepare:types --workspace=nuxt-app

# Start the dev server
npm run dev --workspace=nuxt-app
```

The app will be available at http://localhost:3000.

> **Note:** The `prepare:types` script runs `nuxt prepare` to generate TypeScript declarations for better IDE support. This is optional as `nuxt dev` and `nuxt build` run it automatically.

## Internationalization (i18n)

The example uses English (`en`) locale by default. To change the locale, update `nuxt.config.ts`:

```typescript
ory: {
  project: {
    default_locale: "fr", // or "es", "de", etc.
    locale_behavior: "force_default",
  },
}
```

Available locales are defined in `@ory/elements-vue`.
