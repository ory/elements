// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  defineNuxtModule,
  addServerHandler,
  createResolver,
  addImports,
  addRouteMiddleware,
} from "@nuxt/kit"
import { defu } from "defu"
import type { AccountExperienceConfiguration } from "@ory/client-fetch"

/**
 * Ory Nuxt module options
 */
export interface OryModuleOptions {
  /**
   * The Ory SDK URL (defaults to NUXT_PUBLIC_ORY_SDK_URL or ORY_SDK_URL env vars)
   */
  sdkUrl?: string
  /**
   * Project configuration for Ory account experience
   */
  project?: Partial<AccountExperienceConfiguration>
  /**
   * Additional headers to forward to Ory
   */
  forwardAdditionalHeaders?: string[]
  /**
   * Force a specific cookie domain
   */
  forceCookieDomain?: string
}

export default defineNuxtModule<OryModuleOptions>({
  meta: {
    name: "@ory/nuxt",
    configKey: "ory",
    compatibility: {
      nuxt: ">=3.0.0 || >=4.0.0",
    },
  },
  defaults: {
    project: {
      default_locale: "en",
      default_redirect_url: "/",
      error_ui_url: "/error",
      locale_behavior: "force_default",
      name: "Ory Nuxt App",
      registration_enabled: true,
      verification_enabled: true,
      recovery_enabled: true,
      registration_ui_url: "/auth/registration",
      verification_ui_url: "/auth/verification",
      recovery_ui_url: "/auth/recovery",
      login_ui_url: "/auth/login",
      settings_ui_url: "/settings",
    },
    forwardAdditionalHeaders: [],
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add runtime config
    nuxt.options.runtimeConfig.public.ory = defu(
      nuxt.options.runtimeConfig.public.ory || {},
      {
        sdkUrl: options.sdkUrl || "",
        project: options.project,
      },
    )

    nuxt.options.runtimeConfig.ory = defu(
      nuxt.options.runtimeConfig.ory || {},
      {
        sdkUrl: options.sdkUrl || "",
        forwardAdditionalHeaders: options.forwardAdditionalHeaders,
        forceCookieDomain: options.forceCookieDomain,
      },
    )

    // Add server API routes for proxying Ory requests
    addServerHandler({
      route: "/self-service/**",
      handler: resolver.resolve("./runtime/server/proxy"),
    })

    addServerHandler({
      route: "/sessions/**",
      handler: resolver.resolve("./runtime/server/proxy"),
    })

    addServerHandler({
      route: "/.well-known/ory/**",
      handler: resolver.resolve("./runtime/server/proxy"),
    })

    addServerHandler({
      route: "/.ory/**",
      handler: resolver.resolve("./runtime/server/proxy"),
    })

    // Add auto-imports for composables
    addImports([
      {
        name: "useOryConfig",
        from: resolver.resolve("./runtime/composables/useOryConfig"),
      },
      {
        name: "useOryLoginFlow",
        from: resolver.resolve("./runtime/composables/useOryFlow"),
      },
      {
        name: "useOryRegistrationFlow",
        from: resolver.resolve("./runtime/composables/useOryFlow"),
      },
      {
        name: "useOryRecoveryFlow",
        from: resolver.resolve("./runtime/composables/useOryFlow"),
      },
      {
        name: "useOryVerificationFlow",
        from: resolver.resolve("./runtime/composables/useOryFlow"),
      },
      {
        name: "useOrySettingsFlow",
        from: resolver.resolve("./runtime/composables/useOryFlow"),
      },
      {
        name: "useOryFlowError",
        from: resolver.resolve("./runtime/composables/useOryFlowError"),
      },
      {
        name: "useOrySession",
        from: resolver.resolve("./runtime/composables/useOrySession"),
      },
      {
        name: "useAsyncOrySession",
        from: resolver.resolve("./runtime/composables/useOrySession"),
      },
      {
        name: "useOryLogout",
        from: resolver.resolve("./runtime/composables/useOryLogout"),
      },
    ])

    // Add route middleware for authentication
    addRouteMiddleware({
      name: "auth",
      path: resolver.resolve("./runtime/middleware/auth"),
      global: false,
    })
  },
})

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    ory: {
      sdkUrl: string
      project: Partial<AccountExperienceConfiguration>
    }
  }
  interface RuntimeConfig {
    ory: {
      sdkUrl: string
      forwardAdditionalHeaders?: string[]
      forceCookieDomain?: string
    }
  }
}
