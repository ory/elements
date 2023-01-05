// React
import { useCallback, useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import { useRouter } from "next/router"

// Ory SDK & Ory Client
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserAuthCard from Ory Elements to display the recovery form.
import { UserAuthCard } from "@ory/elements"
import { HandleError } from "../pkg/hooks"

const Recovery: NextPage = () => {
  const [flow, setFlow] = useState<RecoveryFlow>()

  // Get flow information from the URL
  const router = useRouter()
  const handleError = HandleError()

  const { flow: flowId, return_to: returnTo } = router.query

  const getRecoveryFlow = useCallback(
    (id: string) =>
      ory
        .getRecoveryFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
          switch (err.response?.status) {
            case 410:
              // Status code 410 means the request has expired - so let's load a fresh flow!
              router.push("/recovery")
            case 403:
              // Status code 403 implies some other issue (e.g. CSRF) - let's reload!
              router.push("/recovery")
            default:
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
    [],
  )

  const createSettingsFlow = useCallback(
    () =>
      ory
        .createBrowserRecoveryFlow()
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((error: AxiosError) => handleError(error))
        .catch((err: AxiosError) => {
          // If the previous handler did not catch the error it's most likely a form validation error
          if (err.response?.status === 400) {
            // Yup, it is!
            setFlow(err.response?.data)
            return
          }
        }),
    [],
  )

  useEffect(() => {
    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getRecoveryFlow(String(flowId || "")).catch(
        (err: AxiosError) =>
          err.response?.status === 410 ?? createSettingsFlow(),
      )
      // if the flow is expired, we create a new one
      return
    }

    // Otherwise we initialize it
    createSettingsFlow()
  }, [flowId])

  const submitFlow = (values: UpdateRecoveryFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate.
      // This prevents the user losing his data when she/he reloads the page.
      .push(`/recovery?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateRecoveryFlow({
            flow: String(flow?.id),
            updateRecoveryFlowBody: values,
          })
          .then(({ data }) => {
            // Form submission was successful, show the message to the user!
            setFlow(data)
          })
          .catch((error: AxiosError) => handleError(error))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data)
              return
            }

            return Promise.reject(err)
          }),
      )

  return flow ? (
    // create a recovery form that dynamically renders based on the flow data using Ory Elements
    <UserAuthCard
      title={"Recovery"}
      // This defines what kind of card we want to render.
      flowType={"recovery"}
      // we always need the flow data which populates the form fields and error messages dynamically
      flow={flow}
      // the registration card should allow the user to go to the registration page and the login page
      additionalProps={{
        loginURL: "/login",
      }}
      // we might need webauthn support which requires additional js
      includeScripts={true}
      // we submit the form data to Ory
      onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
    />
  ) : (
    <div>Loading...</div>
  )
}

export default Recovery
