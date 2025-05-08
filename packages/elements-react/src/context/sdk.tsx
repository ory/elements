// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useRef } from "react"
import { isProduction } from "../client/config"
import { OryClientConfiguration } from "../util"
import { frontendClient } from "../util/client"
import { ConfigurationParameters, FrontendApi } from "@ory/client-fetch"

export type OrySDK = SDKConfig & {
  /**
   * The frontend client for the Ory SDK.
   * This client is used to interact with the Ory SDK and should be used to make API calls.
   */
  frontend: FrontendApi
}

export function useOrySDK() {
  const sdkConfig = useContext(OrySDKContext)
  return {
    ...sdkConfig,
    frontend: frontendClient(sdkConfig.url, sdkConfig.options),
  }
}

type SDKConfig = {
  /**
   * The URL of the Ory SDK.
   * This URL is used to connect to the Ory SDK and should be set to the base URL of your Ory instance.
   */
  url: string
  options?: Partial<ConfigurationParameters>
}

type OrySDKContextType = SDKConfig

const OrySDKContext = createContext<OrySDKContextType>(computeConfig({}))

export function OrySDKProvider({
  children,
  config: initialConfig,
}: {
  children: React.ReactNode
  config?: Partial<OryClientConfiguration["sdk"]>
}) {
  const configRef = useRef(computeConfig(initialConfig))

  return (
    <OrySDKContext.Provider value={configRef.current}>
      {children}
    </OrySDKContext.Provider>
  )
}

function computeConfig(config?: OryClientConfiguration["sdk"]): SDKConfig {
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
    typeof process === "undefined" ||
    !process.versions ||
    !process.versions.node
  ) {
    // we are in the browser

    // Try to use window location
    if (typeof window !== "undefined") {
      return window.location.origin
    }

    // We aren't in node, and we don't have a window location.
    // This is probably a test environment, so we can't guess the SDK URL.
    throw new Error(
      "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL or supply .",
    )
  }
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
    } else if (typeof window !== "undefined") {
      return window.location.origin
    }
  }

  throw new Error(
    "Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL.",
  )
}
