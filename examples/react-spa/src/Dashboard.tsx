import { Session } from "@ory/client"
import { Typography } from "@ory/elements"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"
import sdk from "./sdk"

export const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [logoutUrl, setLogoutUrl] = useState<string>()

  const navigate = useNavigate()

  useEffect(() => {
    // we check if the user is logged in by checking if there is a session
    // if no session is found, we redirect to the login page
    sdk
      .toSession()
      .then(({ data: session }) => {
        // we set the session data which contains the user Identifier and other traits.
        setSession(session)
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          // the user might have a session, but would require 2FA (Two-Factor Authentication)
          if (error.response?.data.error.id === "session_aal2_required") {
            return navigate("/login?aal2=true", { replace: true })
          }
        }
        // redirect to the login page by default since we assume the user is not signed in
        return navigate("/login", { replace: true })
      })
  }, [])

  useEffect(() => {
    // here we create a new logout URL which we can use to log the user out
    sdk
      .createBrowserLogoutFlow(undefined, {
        params: {
          return_url: "/",
        },
      })
      .then(({ data }) => {
        setLogoutUrl(data.logout_url)
      })
      .catch((data) => {
        console.error(data)
      })
  }, [])

  return (
    <>
      <Typography size={"headline37"}>Welcome to the dashboard!</Typography>
      <Typography size={"headline21"}>
        {session?.identity.traits.firstName} you can logout here:{" "}
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
