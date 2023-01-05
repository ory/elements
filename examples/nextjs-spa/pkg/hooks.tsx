import { AxiosError } from "axios"
import { useRouter } from "next/router"
import { DependencyList, useEffect, useState } from "react"

import { ory } from "./sdk"

export const HandleError = () => {
  const router = useRouter()
  return (error: AxiosError): AxiosError | void => {
    console.dir(`HandleError hook: ${JSON.stringify(error.response)}`)
    switch (error.response?.status) {
      case 404:
        // The flow data could not be found. Let's just redirect to the error page!
        window.location.href = `/error?error=${encodeURIComponent(
          JSON.stringify(error),
        )}`
        return
      case 422:
        // we need to parse the response and follow the `redirect_browser_to` URL
        // this could be when the user needs to perform a 2FA challenge
        // or passwordless login
        const { redirect_browser_to } = error.response?.data
        if (redirect_browser_to) {
          window.location.href = redirect_browser_to
        }
        return
      // we have no session or the session is invalid
      // we should redirect the user to the login page
      // don't handle it here, return the error so the caller can handle it
      case 401:
      // we have some form validation errors
      case 400:
        return error
      case 410:
        // Status code 410 means the request has expired - so let's load a fresh flow!
        router.reload()
      default:
        // The flow could not be fetched due to e.g. network or server issues. Let's reload the page!
        // This will trigger the useEffect hook again and we will try to fetch the flow again.
        router.reload()
    }
  }
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
