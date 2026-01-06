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
│   ├── auth/
│   │   ├── login.vue      # Login flow
│   │   ├── registration.vue
│   │   ├── recovery.vue
│   │   └── verification.vue
│   ├── settings.vue       # Protected settings page
│   ├── error.vue          # Error display page
│   └── index.vue          # Home page with session status
├── nuxt.config.ts         # Nuxt & Ory module configuration
└── public/
    └── ory-logo.svg       # Project logo
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
      default_locale: "es",
      locale_behavior: "force_default",

      // Branding
      name: "Ory Nuxt Example",
      logo_light_url: "/ory-logo.svg",

      // Feature flags
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,

      // UI URLs (must match your pages)
      login_ui_url: "/auth/login",
      registration_ui_url: "/auth/registration",
      verification_ui_url: "/auth/verification",
      recovery_ui_url: "/auth/recovery",
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
@import "tailwindcss";

/* Scan @ory/elements-vue for Tailwind classes */
@source "../../node_modules/@ory/elements-vue/dist/**/*.{js,mjs}";

/* Define CSS custom properties for theming */
:root {
  --ui-50: #f8fafc;
  /* ... color palette ... */
}

/* Map to Tailwind 4 theme */
@theme {
  --color-button-primary-background-default: var(--interface-background-brand-primary);
  /* ... component tokens ... */
}
```

The `@source` directive tells Tailwind to scan the Ory elements package for class names used in components.

## Using Ory Components

### Auth Pages

Import the flow component and use the corresponding composable:

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
    <NuxtLink to="/auth/login">Login</NuxtLink>
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

# Start the dev server
npm run dev --workspace=nuxt-app
```

The app will be available at http://localhost:3000.

## Internationalization (i18n)

The example uses Spanish (`es`) locale by default. To change the locale, update `nuxt.config.ts`:

```typescript
ory: {
  project: {
    default_locale: "en", // or "fr", "de", etc.
    locale_behavior: "force_default",
  },
}
```

Available locales are defined in `@ory/elements-vue/locales`.
