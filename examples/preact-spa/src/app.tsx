import { Session } from "@ory/client"
import { Typography } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import { useLocation } from "wouter"
import "./app.css"
import { sdk, sdkError } from "./sdk"

export const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [logoutUrl, setLogoutUrl] = useState<string>()
  const [location, setLocation] = useLocation()

  const sdkErrorHandler = sdkError(undefined, undefined, "/login")

  const createLogoutFlow = () => {
    sdk
      .createBrowserLogoutFlow(undefined, {
        params: {
          return_url: "/",
        },
      })
      .then(({ data }) => {
        setLogoutUrl(data.logout_url)
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    sdk
      .toSession()
      .then(({ data: session }) => {
        // we set the session data which contains the user Identifier and other traits.
        setSession(session)
        // Set logout flow
        createLogoutFlow()
      })
      .catch(sdkErrorHandler)
      .catch((error) => {
        // Handle all other errors like error.message "network error" if Kratos can not be connected etc.
        if (error.message) {
          return setLocation(
            `/error?error=${encodeURIComponent(error.message)}`,
            {
              replace: true,
            },
          )
        }

        // Just stringify error and print all data
        setLocation(
          `/error?error=${encodeURIComponent(JSON.stringify(error))}`,
          {
            replace: true,
          },
        )
      })
  }, [])

  return (
    <>
      <Typography size={"headline37"}>Welcome to the dashboard!</Typography>
      <Typography size={"headline21"}>
        {session?.identity?.traits.firstName} you can logout here:{" "}
        <a href={logoutUrl}>Logout</a> or go to your settings page here:{" "}
        <a href="/settings">Settings</a>
      </Typography>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </>
  )
}
