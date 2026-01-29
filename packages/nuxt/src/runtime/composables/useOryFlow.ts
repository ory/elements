// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-misused-promises */

import {
  FlowType,
  LoginFlow,
  RegistrationFlow,
  RecoveryFlow,
  VerificationFlow,
  SettingsFlow,
  handleFlowError,
  ApiResponse,
  FrontendApi,
} from "@ory/client-fetch"
import {
  useRequestHeaders,
  useRoute,
  useRuntimeConfig,
  useRequestEvent,
  useAsyncData,
} from "#imports"
import { sendRedirect } from "h3"
import {
  createFrontendClient,
  guessPotentiallyProxiedOrySdkUrl,
  orySdkUrl,
} from "../utils/sdk"
import { rewriteJsonResponse } from "../utils/rewrite"
import type { QueryParams } from "../types"
import { initOverrides } from "../types"

type FlowGetterResult<T> = T | null

interface FlowConfig<T> {
  flowType: FlowType
  cacheKeyPrefix: string
  defaultUiUrl: string
  getFlowRaw: (
    frontend: FrontendApi,
    flowId: string,
    cookie: string | undefined,
  ) => Promise<ApiResponse<T>>
}

/**
 * Internal factory for fetching flows
 */
async function getFlowFactory<T extends object>(
  params: QueryParams,
  fetchFlowRaw: () => Promise<ApiResponse<T>>,
  flowType: FlowType,
  sdkUrl: string,
  proxyUrl: string,
  route: string,
  event: ReturnType<typeof useRequestEvent>,
): Promise<T | null> {
  const performRedirect = async (url: string) => {
    if (event && import.meta.server) {
      await sendRedirect(event, url, 302)
    } else if (typeof window !== "undefined") {
      window.location.href = url
    }
    return null
  }

  const onRestartFlow = async (useFlowId?: string): Promise<null> => {
    if (!useFlowId) {
      const redirectUrl = new URL(`/self-service/${flowType}/browser`, proxyUrl)
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          redirectUrl.searchParams.set(
            key,
            Array.isArray(value) ? value[0] : value,
          )
        }
      })
      await performRedirect(redirectUrl.toString())
      return null
    }

    const redirectTo = new URL(route, proxyUrl)
    redirectTo.searchParams.set("flow", useFlowId)
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "flow" && value) {
        redirectTo.searchParams.set(
          key,
          Array.isArray(value) ? value[0] : value,
        )
      }
    })
    await performRedirect(redirectTo.toString())
    return null
  }

  if (!params["flow"]) {
    return onRestartFlow()
  }

  try {
    const rawResponse = await fetchFlowRaw()
    const flow = await rawResponse.value()
    return rewriteJsonResponse(flow, sdkUrl, proxyUrl)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError: () => null,
      onRestartFlow,
      onRedirect: async (url) => {
        const rewrittenUrl = url.replaceAll(sdkUrl, proxyUrl)
        await performRedirect(rewrittenUrl)
        return null
      },
    })

    const result = await errorHandler(error)
    return result ?? null
  }
}

/**
 * Creates an Ory flow composable with the given configuration.
 */
function createFlowComposable<T extends object>(
  config: FlowConfig<T>,
): () => Promise<FlowGetterResult<T>> {
  return async function useOryFlow(): Promise<FlowGetterResult<T>> {
    const route = useRoute()
    const params: QueryParams = route.query as QueryParams
    const flowId = params.flow?.toString() ?? ""

    const { data } = await useAsyncData(
      `${config.cacheKeyPrefix}-${flowId}`,
      async () => {
        const headers = useRequestHeaders([
          "cookie",
          "host",
          "x-forwarded-proto",
        ])
        const runtimeConfig = useRuntimeConfig()
        const event = useRequestEvent()
        const frontend = createFrontendClient()
        const sdkUrl = orySdkUrl()
        const cookie = headers.cookie

        const protocol = headers["x-forwarded-proto"] || "https"
        const proxyUrl = guessPotentiallyProxiedOrySdkUrl({
          knownProxiedUrl: headers.host ? `${protocol}://${headers.host}` : "",
        })

        const uiUrl =
          getUiUrl(runtimeConfig, config.flowType) || config.defaultUiUrl

        return getFlowFactory(
          params,
          () => config.getFlowRaw(frontend, flowId, cookie),
          config.flowType,
          sdkUrl,
          proxyUrl,
          uiUrl,
          event,
        )
      },
      { server: true, lazy: false },
    )

    return data.value
  }
}

/**
 * Gets the UI URL from runtime config based on flow type.
 */
function getUiUrl(
  config: ReturnType<typeof useRuntimeConfig>,
  flowType: FlowType,
): string | undefined {
  const project = config.public.ory?.project
  if (!project) return undefined

  switch (flowType) {
    case FlowType.Login:
      return project.login_ui_url
    case FlowType.Registration:
      return project.registration_ui_url
    case FlowType.Recovery:
      return project.recovery_ui_url
    case FlowType.Verification:
      return project.verification_ui_url
    case FlowType.Settings:
      return project.settings_ui_url
    default:
      return undefined
  }
}

/**
 * Get the Login flow for the current request
 *
 * @example
 * ```vue
 * <script setup>
 * const flow = await useOryLoginFlow()
 *
 * if (!flow) {
 *   // Will redirect to create a new flow
 * }
 * </script>
 *
 * <template>
 *   <Login v-if="flow" :flow="flow" :config="config" />
 * </template>
 * ```
 */
export const useOryLoginFlow = createFlowComposable<LoginFlow>({
  flowType: FlowType.Login,
  cacheKeyPrefix: "ory-login-flow",
  defaultUiUrl: "/auth/login",
  getFlowRaw: (frontend, flowId, cookie) =>
    frontend.getLoginFlowRaw({ id: flowId, cookie }, initOverrides),
})

/**
 * Get the Registration flow for the current request
 */
export const useOryRegistrationFlow = createFlowComposable<RegistrationFlow>({
  flowType: FlowType.Registration,
  cacheKeyPrefix: "ory-registration-flow",
  defaultUiUrl: "/auth/registration",
  getFlowRaw: (frontend, flowId, cookie) =>
    frontend.getRegistrationFlowRaw({ id: flowId, cookie }, initOverrides),
})

/**
 * Get the Recovery flow for the current request
 */
export const useOryRecoveryFlow = createFlowComposable<RecoveryFlow>({
  flowType: FlowType.Recovery,
  cacheKeyPrefix: "ory-recovery-flow",
  defaultUiUrl: "/auth/recovery",
  getFlowRaw: (frontend, flowId, cookie) =>
    frontend.getRecoveryFlowRaw({ id: flowId, cookie }, initOverrides),
})

/**
 * Get the Verification flow for the current request
 */
export const useOryVerificationFlow = createFlowComposable<VerificationFlow>({
  flowType: FlowType.Verification,
  cacheKeyPrefix: "ory-verification-flow",
  defaultUiUrl: "/auth/verification",
  getFlowRaw: (frontend, flowId, cookie) =>
    frontend.getVerificationFlowRaw({ id: flowId, cookie }, initOverrides),
})

/**
 * Get the Settings flow for the current request
 */
export const useOrySettingsFlow = createFlowComposable<SettingsFlow>({
  flowType: FlowType.Settings,
  cacheKeyPrefix: "ory-settings-flow",
  defaultUiUrl: "/settings",
  getFlowRaw: (frontend, flowId, cookie) =>
    frontend.getSettingsFlowRaw({ id: flowId, cookie }, initOverrides),
})
