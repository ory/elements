// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createContext, PropsWithChildren, useContext, useRef } from "react"
import { isProduction } from "../client/config"
import { OryClientConfiguration } from "../util"
import { frontendClient } from "../util/client"
import {
  AccountExperienceConfiguration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"

export type OryElementsConfiguration = {
  sdk: OrySDK
  project: AccountExperienceConfiguration
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

export function useOryConfiguration(): OryElementsConfiguration {
  const configCtx = useContext(OryConfigurationContext)
  return {
    sdk: {
      ...configCtx.sdk,
      frontend: frontendClient(configCtx.sdk.url, configCtx.sdk.options),
    },
    project: {
      ...configCtx.project,
    },
  }
}

export type OrySDK = SDKConfig & {
  /**
   * The frontend client for the Ory SDK.
   * This client is used to interact with the Ory SDK and should be used to make API calls.
   */
  frontend: FrontendApi
}

type SDKConfig = {
  /**
   * The URL of the Ory SDK.
   * This URL is used to connect to the Ory SDK and should be set to the base URL of your Ory instance.
   */
  url: string
  options?: Partial<ConfigurationParameters>
}

type OryElementsConfigContextType = {
  sdk: SDKConfig
  project: AccountExperienceConfiguration
}

const OryConfigurationContext = createContext<OryElementsConfigContextType>({
  sdk: computeSdkConfig({}),
  project: defaultProject,
})

export function OryConfigurationProvider({
  children,
  sdk: initialConfig,
  project,
}: PropsWithChildren<{
  sdk?: Partial<OryClientConfiguration["sdk"]>
  project?: Partial<AccountExperienceConfiguration>
}>) {
  const configRef = useRef({
    sdk: computeSdkConfig(initialConfig),
    project: {
      ...defaultProject,
      ...project,
    },
  })

  return (
    <OryConfigurationContext.Provider value={configRef.current}>
      {children}
    </OryConfigurationContext.Provider>
  )
}

function computeSdkConfig(config?: OryClientConfiguration["sdk"]): SDKConfig {
  if (config?.url && typeof config.url === "string") {
    return {
      url: config.url.replace(/\/$/, ""),
      options: config.options || {},
    }
  }

  return {
    url: getSDKUrl(),
    options: config?.options || {},
  }
}

function getSDKUrl() {
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    // process is available, let's try some environment variables
    if (isProduction()) {
      const sdkUrl =
        process.env["NEXT_PUBLIC_ORY_SDK_URL"] ?? process.env["ORY_SDK_URL"]
      if (!sdkUrl) {
        throw new Error(
          "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL in production environments.",
        )
      }
      return sdkUrl.replace(/\/$/, "")
    } else {
      if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
        return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
      } else if (process.env["VERCEL_URL"]) {
        return `https://${process.env["VERCEL_URL"]}`.replace(/\/$/, "")
      }
    }
  }

  if (typeof window !== "undefined") {
    // we are in the browser

    // Try to use window location
    return window.location.origin
  }
  // We aren't in node, and we don't have a window location.
  // This is probably a test environment, so we can't guess the SDK URL.

  throw new Error(
    "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL or supply the sdk.url parameter in the Ory configuration.",
  )
}
