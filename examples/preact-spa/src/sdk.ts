// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FrontendApi, Configuration } from "@ory/client"
import { AxiosError } from "axios"
import { useCallback } from "preact/hooks"
import { StateUpdater } from "preact/compat"
import { useLocation } from "wouter"

export const sdk = new FrontendApi(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath: import.meta.env.VITE_ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    },
  }),
)

/**
 * @param getFlow - Should be function to load a flow make it visible (Login.getFlow)
 * @param setFlow - Update flow data to view (Login.setFlow)
 * @param defaultNav - Default navigate target for errors
 * @param fatalToDash - When true and error can not be handled, then redirect to dashboard, else rethrow error
 */
export const sdkError = (
  getFlow: ((flowId: string) => Promise<void | AxiosError>) | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFlow: StateUpdater<any> | undefined,
  defaultNav: string | undefined,
  fatalToDash = false,
) => {
  const [location, setLocation] = useLocation()

  return useCallback(
    (error: AxiosError): Promise<AxiosError | void> => {
      const responseData = error.response?.data || {}

      switch (error.response?.status) {
        case 400: {
          // the request could contain invalid parameters which would set error messages in the flow
          if (setFlow !== undefined) {
            console.warn("sdkError 400: update flow data")
            setFlow(responseData)
            return Promise.resolve()
          }
          break
        }
        case 401: {
          console.warn("sdkError 401: Navigate to /login")
          setLocation("/login", { replace: true })
          return Promise.resolve()
        }
        case 403: {
          // the user might have a session, but would require 2FA (Two-Factor Authentication)
          if (responseData.error?.id === "session_aal2_required") {
            setLocation("/login?aal2=true", { replace: true })
            return Promise.resolve()
          }

          if (
            responseData.error?.id === "session_refresh_required" &&
            responseData.redirect_browser_to
          ) {
            console.warn("sdkError 403: Redirect browser to")
            window.location = responseData.redirect_browser_to
            return Promise.resolve()
          }
          break
        }
        case 404: {
          if (defaultNav !== undefined) {
            console.warn("sdkError 404: Navigate to Error")
            const errorMsg = {
              data: error.response?.data || error,
              status: error.response?.status,
              statusText: error.response?.statusText,
              url: window.location.href,
            }

            setLocation(
              `/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`,
              {
                replace: true,
              },
            )
            return Promise.resolve()
          }
          break
        }
        case 410: {
          if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
            console.warn("sdkError 410: Update flow")
            return getFlow(responseData.use_flow_id).catch((error) => {
              // Something went seriously wrong - log and redirect to defaultNav if possible
              console.error(error)

              if (defaultNav !== undefined) {
                setLocation(defaultNav, { replace: true })
              } else {
                // Rethrow error when can't navigate and let caller handle
                throw error
              }
            })
          } else if (defaultNav !== undefined) {
            console.warn("sdkError 410: Navigate to", defaultNav)
            setLocation(defaultNav, { replace: true })
            return Promise.resolve()
          }
          break
        }
        case 422: {
          if (responseData.redirect_browser_to !== undefined) {
            const currentUrl = new URL(window.location.href)
            const redirect = new URL(responseData.redirect_browser_to)

            // host name has changed, then change location
            if (currentUrl.host !== redirect.host) {
              console.warn("sdkError 422: Host changed redirect")
              window.location = responseData.redirect_browser_to
              return Promise.resolve()
            }

            // Path has changed
            if (currentUrl.pathname !== redirect.pathname) {
              console.warn("sdkError 422: Update path")
              setLocation(redirect.pathname + redirect.search, { replace: true })
              return Promise.resolve()
            }

            // for webauthn we need to reload the flow
            const flowId = redirect.searchParams.get("flow")

            if (flowId != null && getFlow !== undefined) {
              // get new flow data based on the flow id in the redirect url
              console.warn("sdkError 422: Update flow")
              return getFlow(flowId).catch((error) => {
                // Something went seriously wrong - log and redirect to defaultNav if possible
                console.error(error)

                if (defaultNav !== undefined) {
                  setLocation(defaultNav, { replace: true })
                } else {
                  // Rethrow error when can't navigate and let caller handle
                  throw error
                }
              })
            } else {
              console.warn("sdkError 422: Redirect browser to")
              window.location = responseData.redirect_browser_to
              return Promise.resolve()
            }
          }
        }
      }

      console.error(error)

      if (fatalToDash) {
        console.warn("sdkError: fatal error redirect to dashboard")
        setLocation("/", { replace: true })
        return Promise.resolve()
      }

      throw error
    },
    [setLocation, getFlow],
  )
}

export const getSearchParam = (searchParam: string) => {
  return new URLSearchParams(new URL(window.location.toString()).search).get(
    searchParam,
  )
}
