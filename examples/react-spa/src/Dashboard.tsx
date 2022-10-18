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
    sdk
      .toSession()
      .then(({ data: session }) => {
        setSession(session)
      })
      .catch((error) => {
        if (error.response?.status === 403) {
          if (error.response?.data.error.id === "session_aal2_required") {
            return navigate("/login?aal2=true", { replace: true })
          }
        }
        return navigate("/login", { replace: true })
      })
  }, [])

  useEffect(() => {
    sdk
      .createSelfServiceLogoutFlowUrlForBrowsers(undefined, {
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
        <a href={logoutUrl}>Logout</a> or go to your settings page here:{" "}
        <a href="/settings">Settings</a>
      </Typography>
      <pre>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
    </>
  )
}
