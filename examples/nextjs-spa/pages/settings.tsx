// React
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"
import Link from "next/link"

// Ory SDK
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserSettingsCard from Ory Elements to display the settings form.
import {
  gridStyle,
  NodeMessages,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"
import { HandleError } from "../pkg/hooks"

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()
  const handleError = HandleError()

  // Get flow information from the URL
  const router = useRouter()

  const getSettingsFlow = useCallback(
    (id: string) =>
      ory
        .getSettingsFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch((err: AxiosError) => {
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
    [],
  )

  const createSettingsFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserSettingsFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(async (err: AxiosError) => {
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
          return Promise.reject(err)
        }),
    [],
  )

  useEffect(() => {
    const {
      flow: flowId,
      return_to: returnTo,
      passwordChange: changed,
    } = router.query

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getSettingsFlow(String(flowId || "")).catch(
        (err: AxiosError) =>
          err.response?.status === 410 ??
          createSettingsFlow(String(returnTo || "")),
      )
      return
    }

    // Otherwise we initialize it
    createSettingsFlow(String(returnTo || ""))
  }, [])

  const onSubmit = (values: UpdateSettingsFlowBody) => {
    router
      // On submission, add the flow ID to the URL but do not navigate.
      // This prevents the user losing his data when she/he reloads the page.
      .push(`/settings?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .updateSettingsFlow({
            flow: String(flow?.id),
            updateSettingsFlowBody: values,
          })
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            setFlow(data)
          })
          .catch((err: AxiosError) => handleError(err))
          .catch((err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            switch (err.response?.status) {
              case 400:
                // Yup, it is!
                setFlow(err.response?.data)
                return
              case 401:
                // The user is not authenticated anymore.
                // Let's redirect them to the login page.
                router.push("/login")
                return
              default:
                // Otherwise, we show the error page.
                router.push({
                  pathname: "/error",
                  query: {
                    error: JSON.stringify(err, null, 2),
                  },
                })
            }
          }),
      )
    return router.push({
      pathname: "/settings",
      query: {
        flow: flow?.id,
        // Allows us to show a success message after the user has changed their password
        passwordChange: "Your password has been successfully changed!",
      },
    })
  }

  // if the flow is not set, we show a loading indicator
  return flow ? (
    // create a settings form that dynamically renders based on the flow data using Ory Elements
    // This card is more complicated, as it is dynamically rendered based on the flow data from your Ory Console project.
    <>
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <div id="settingsForm" className={gridStyle({ gap: 16 })}>
        {/* Show a success message if the user changed their password */}
        <NodeMessages nodes={flow.ui.nodes} />
        {/* here we simply map all of the settings flows we could have. These flows won't render if they aren't enabled inside your Ory Network project */}
        {(
          [
            "profile",
            "password",
            "totp",
            "webauthn",
            "lookupSecret",
          ] as UserSettingsFlowType[]
        ).map((flowType: UserSettingsFlowType, index) => (
          // here we render the settings flow using Ory Elements
          <UserSettingsCard
            key={index}
            // we always need to pass the component the flow since it contains the form fields, error messages and csrf token
            flow={flow}
            flowType={flowType}
            // include scripts for webauthn support
            includeScripts={true}
            // submit the form data the user provides to Ory
            onSubmit={({ body }) => onSubmit(body)}
          />
        ))}
      </div>
    </>
  ) : (
    <div>Loading...</div>
  )
}

export default Settings
