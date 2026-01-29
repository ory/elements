// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: "%s - Ory Nuxt Example",
    },
  },

  modules: ["@ory/nuxt"],

  ory: {
    project: {
      default_locale: "en",
      default_redirect_url: "/",
      error_ui_url: "/error",
      locale_behavior: "force_default",
      name: "Ory Nuxt Example",
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
      registration_ui_url: "/registration",
      verification_ui_url: "/verification",
      recovery_ui_url: "/recovery",
      login_ui_url: "/login",
      settings_ui_url: "/settings",
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [],
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
