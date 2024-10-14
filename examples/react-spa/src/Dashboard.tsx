// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client"
import { Typography } from "@ory/elements"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"
import { sdk, sdkError } from "./sdk"

export const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [logoutUrl, setLogoutUrl] = useState<string>()

  const navigate = useNavigate()
  const sdkErrorHandler = sdkError(undefined, undefined, "/login")

  const createLogoutFlow = () => {
    // here we create a new logout URL which we can use to log the user out
    sdk
      .createBrowserLogoutFlow(undefined, {
        params: {
          return_url: "/",
        },
      })
      .then(({ data }) => setLogoutUrl(data.logout_url))
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // we check if the user is logged in by checking if there is a session
    // if no session is found, we redirect to the login page
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
          return navigate(`/error?error=${encodeURIComponent(error.message)}`, {
            replace: true,
          })
        }

        // Just stringify error and print all data
        navigate(`/error?error=${encodeURIComponent(JSON.stringify(error))}`, {
          replace: true,
        })
      })
  }, [])

  return (
    <>
      <Typography size={"headline37"}>Welcome to the dashboard!</Typography>
      <Typography size={"headline21"}>
        {session?.identity?.traits.firstName} you can logout here:{" "}
        {/* Allow the user to logout */}
        <a href={logoutUrl}>Logout</a> or go to your settings page here:{" "}
        <a href="/settings">Settings</a>
      </Typography>
      <pre>
        {/* Show the session data which contains the Identity traits */}
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </>
  )
}
