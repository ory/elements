// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { inject, provide, ref, type InjectionKey, type Ref } from "vue"
import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
  FrontendApi,
  Configuration,
} from "@ory/client-fetch"

/**
 * SDK configuration type
 */
export type OrySDKConfig = {
  url: string
  options?: Partial<ConfigurationParameters>
}

/**
 * Full SDK type with frontend client
 */
export type OrySDK = OrySDKConfig & {
  frontend: FrontendApi
}

/**
 * Ory Elements configuration
 */
export type OryElementsConfiguration = {
  sdk: OrySDK
  project: AccountExperienceConfiguration
}

/**
 * Client configuration interface
 */
export interface OryClientConfiguration {
  sdk?: {
    url?: string
    options?: Partial<ConfigurationParameters>
  }
  project?: Partial<AccountExperienceConfiguration>
}

const defaultProject: AccountExperienceConfiguration = {
  name: "Ory",
  registration_enabled: true,
  verification_enabled: true,
  recovery_enabled: true,
  recovery_ui_url: "/ui/recovery",
  registration_ui_url: "/ui/registration",
  verification_ui_url: "/ui/verification",
  login_ui_url: "/ui/login",
  settings_ui_url: "/ui/settings",
  default_redirect_url: "/ui/welcome",
  error_ui_url: "/ui/error",
  default_locale: "en",
  locale_behavior: "force_default",
}

export type OryConfigContextValue = {
  config: Ref<OryElementsConfiguration>
}

export const OryConfigKey: InjectionKey<OryConfigContextValue> =
  Symbol("OryConfig")

function createFrontendClient(
  url: string,
  options?: Partial<ConfigurationParameters>,
): FrontendApi {
  const config = new Configuration({
    basePath: url,
    ...options,
  })
  return new FrontendApi(config)
}

function getSDKUrl(): string {
  if (typeof process !== "undefined" && process.env) {
    const sdkUrl =
      process.env["VITE_ORY_SDK_URL"] ??
      process.env["ORY_SDK_URL"] ??
      process.env["NUXT_PUBLIC_ORY_SDK_URL"]
    if (sdkUrl) {
      return sdkUrl.replace(/\/$/, "")
    }
  }

  if (typeof window !== "undefined") {
    return window.location.origin
  }

  throw new Error(
    "Unable to determine SDK URL. Please set VITE_ORY_SDK_URL or ORY_SDK_URL or supply the sdk.url parameter in the Ory configuration.",
  )
}

/**
 * Provide the Ory configuration context
 */
export function provideOryConfig(clientConfig?: OryClientConfiguration) {
  const sdkUrl = clientConfig?.sdk?.url ?? getSDKUrl()
  const frontend = createFrontendClient(sdkUrl, clientConfig?.sdk?.options)

  const configValue: OryElementsConfiguration = {
    sdk: {
      url: sdkUrl,
      options: clientConfig?.sdk?.options ?? {},
      frontend,
    },
    project: {
      ...defaultProject,
      ...clientConfig?.project,
    },
  }

  const config = ref(configValue) as Ref<OryElementsConfiguration>

  const context: OryConfigContextValue = { config }

  provide(OryConfigKey, context)

  return context
}

/**
 * Use the Ory configuration context
 */
export function useOryConfig(): OryElementsConfiguration {
  const context = inject(OryConfigKey)
  if (!context) {
    throw new Error(
      "useOryConfig must be used within a component that has called provideOryConfig",
    )
  }
  return context.config.value
}
