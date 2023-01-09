// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { UpdateVerificationFlowBody, VerificationFlow } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the verification form.
import { UserAuthCard } from "@ory/elements"
import { QueryParams } from "../pkg/helpers"
import { HandleError } from "../pkg/hooks"

const Verification: NextPage = () => {
  const [flow, setFlow] = useState<VerificationFlow | null>(null)

  const handleError = HandleError()

  // Get ?flow=... from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getVerificationFlow = useCallback(
    (id: string) =>
      ory
        .getVerificationFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => handleError(err))
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
              // Status code 410 means the request has expired - so let's load a fresh flow!
              return router.push("/verification")
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              return router.push("/verification")
          }
          if (err.response?.status === 401) {
            router.push("/login")
          } else {
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname,
              },
            })
          }
        }),
    [router, handleError],
  )

  const createVerificationFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserVerificationFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
          router.push(`/verification?flow=${data.id}`, undefined, {
            shallow: true,
          })
        })
        .catch((err: AxiosError) => handleError(err))
        .catch((err: AxiosError) => {
          if (err.response?.status === 400) {
            // Status code 400 implies the user is already signed in
            return router.push("/")
          } else {
            router.push({
              pathname: "/error",
              query: {
                error: JSON.stringify(err, null, 2),
                id: err.response?.data.error?.id,
                flowType: router.pathname,
              },
            })
          }
        }),
    [router, handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getVerificationFlow(flowId).catch(() => createVerificationFlow(returnTo)) // the flow might be expired, so we create a new one
      return
    }

    // Otherwise we initialize it
    createVerificationFlow(returnTo)
  }, [
    getVerificationFlow,
    createVerificationFlow,
    flowId,
    returnTo,
    router.isReady,
  ])

  const submitFlow = (values: UpdateVerificationFlowBody) =>
    ory
      .updateVerificationFlow({
        flow: String(flow?.id),
        updateVerificationFlowBody: values,
      })
      .then(({ data }) => {
        // Form submission was successful, show the message to the user!
        setFlow(data)
      })
      .catch((err: AxiosError) => handleError(err))
      .catch((err: AxiosError) => {
        switch (err.response?.status) {
          case 400:
            // Status code 400 implies the form validation had an error
            setFlow(err.response?.data)
            return
          case 422:
            // get new flow data based on the flow id in the redirect url
            const flow =
              QueryParams(err.response.data.redirect_browser_to).get("flow") ||
              ""
            // add the new flowid to the URL
            router.push(
              `/verification${flow ? `?flow=${flow}` : ""}`,
              undefined,
              {
                shallow: true,
              },
            )
            break
          default:
            return Promise.reject(err)
        }
      })

  return flow ? (
    // create a verification form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      cardImage="/ory.svg"
      title={"Verification"}
      flowType={"verification"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the verification card should allow the user to go to the registration page and the login page
      additionalProps={{
        signupURL: "/registration",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateVerificationFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

export default Verification
