import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { DependencyList, useCallback, useEffect, useState } from "react"

import { ory } from "./sdk"

export const HandleError = () => {
  const router = useRouter()
  return useCallback(
    (error: AxiosError): Promise<AxiosError | void> => {
      console.log(`HandleError hook: ${JSON.stringify(error.response)}`)
      if (!error.response || error.response?.status === 0) {
        window.location.href = `/error?error=${encodeURIComponent(
          JSON.stringify(error.response),
        )}`
        return Promise.resolve()
      }

      // handle specific error ids here
      switch (error.response.data?.error.id) {
        case "session_aal2_required":
          router.push({
            pathname: "/login",
            query: {
              aal: "aal2",
            },
          })
          return Promise.resolve()
        case "session_already_available":
          router.push("/")
          return Promise.resolve()
        case "session_refresh_required":
          router.push({
            pathname: "/login",
            query: {
              refresh: true,
              returnTo: router.pathname,
            },
          })
          return Promise.resolve()
        case "self_service_flow_return_to_forbidden":
        // the flow expired, so just reload the page without the flow id
        case "self_service_flow_expired":
          // the flow expired, so just reload the page without the flow id
          router.push(router.pathname)
          return Promise.resolve()
      }

      switch (error.response?.status) {
        // this could be many things, such as the session exists
        case 400:
          return Promise.reject(error)
        case 404:
          // The flow data could not be found. Let's just redirect to the error page!
          window.location.href = `/error?error=${encodeURIComponent(
            JSON.stringify(error.response),
          )}`
          return Promise.resolve()
        // we need to parse the response and follow the `redirect_browser_to` URL
        // this could be when the user needs to perform a 2FA challenge
        // or passwordless login
        case 422:
        // we have no session or the session is invalid
        // we should redirect the user to the login page
        // don't handle it here, return the error so the caller can handle it
        case 401:
          return Promise.reject(error)
        case 410:
          // Status code 410 means the request has expired - so let's load a fresh flow!
          router.push(router.pathname)
          return Promise.resolve()
        default:
          // The flow could not be fetched due to e.g. network or server issues. Let's reload the page!
          // This will trigger the useEffect hook again and we will try to fetch the flow again.
          return Promise.resolve(router.reload())
      }
    },
    [router],
  )
}

// Returns a function which will log the user out
export function LogoutLink(deps?: DependencyList) {
  const [logoutToken, setLogoutToken] = useState<string>("")
  const handleError = HandleError()
  const router = useRouter()

  useEffect(() => {
    ory
      .createBrowserLogoutFlow()
      .then(({ data }) => {
        setLogoutToken(data.logout_token)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 401:
            // do nothing, the user is not logged in
            return
        }
      })
      .catch((err: AxiosError) => handleError(err))
  }, deps)

  return () => {
    if (logoutToken) {
      ory
        .updateLogoutFlow({ token: logoutToken })
        .then(() => router.push("/login"))
        .then(() => router.reload())
    }
  }
}
