import { FlowError } from "@ory/client"
import { CodeBox } from "@ory/elements"
import { AxiosError } from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { stringify } from "querystring"
import { useEffect, useState } from "react"

import { ory } from "../components/sdk"

const Login: NextPage = () => {
  const [error, setError] = useState<FlowError | string>()

  // Get ?id=... from the URL
  const router = useRouter()
  const { id } = router.query
  const { flowType } = router.query
  const fullError = router.query

  const decodeURL = (string: string) => {
    if (string.indexOf("%") !== -1) {
      return decodeURIComponent(string)
    }
    return string
  }

  let errorPrint = decodeURL(stringify(fullError))
  errorPrint = errorPrint.replace(/\\n/g, "\n")

  useEffect(() => {
    // If the router is not ready yet, or we already have an error, do nothing.
    if (!router.isReady || error) {
      return
    }

    ory
      .getFlowError({ id: String(id) })
      .then(({ data }) => {
        setError(data)
      })
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 404:
          // The error id could not be found. Let's just redirect home!
          // router.push("/")
          case 403:
          // The error id could not be fetched due to e.g. a CSRF issue. Let's just redirect home!
          // router.push("/")
          case 410:
          // The error id expired. Let's just redirect home!
          // router.push("/")
        }

        return Promise.reject(err)
      })
  }, [id, router, router.isReady, error])

  switch (id) {
    case "session_inactive":
      // The user's session is inactive. Let's just redirect to login!
      router.push("/login")
    case "session_aal2_required":
      return (
        <>
          <h1>
            <Link href="/">Home</Link>
          </h1>
          <CodeBox>{errorPrint}</CodeBox>
          <h1>You have not set up 2FA and it is required!</h1>
        </>
      )
    case "session_already_available":
      // The user is already logged in. Let's just redirect home!
      router.push("/")
    case "session_refresh_required":
      // The user's session has expired. Let's just redirect to login!
      router.push("/login")
    case "self_service_flow_return_to_forbidden":
      // The flow expired, let's request a new one.
      router.push("/" + flowType)
    case "self_service_flow_expired":
      // The flow expired, let's request a new one.
      router.push("/" + flowType)
    case "security_csrf_violation":
      // A CSRF violation occurred. Best to just refresh the flow!
      router.push("/" + flowType)
    case "security_identity_mismatch":
      // The requested item was intended for someone else. Let's request a new flow...
      router.push("/" + flowType)
  }

  return (
    <>
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <CodeBox>{errorPrint}</CodeBox>
      <h1>Oops!</h1>
    </>
  )
}

export default Login
