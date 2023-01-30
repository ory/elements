// React
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

// Next.js

// Ory SDK
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { ory } from "../pkg/sdk"

// Misc.
import { AxiosError } from "axios"

// Ory Elements
// We will use UserSettingsCard from Ory Elements to display the settings form.
import Layout from "@/components/layout"
import {
  gridStyle,
  NodeMessages,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"
import { HandleError } from "../pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Settings: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<SettingsFlow>()
  const handleError = HandleError()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

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
          }
          return err
        })
        .catch((err: AxiosError) => handleError(err)),
    [handleError, router],
  )

  const createSettingsFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserSettingsFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
          router.push(`/settings?flow=${data.id}`, undefined, { shallow: true })
        })
        .catch((err: AxiosError) => handleError(err))
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            router.push("/login")
            return
          }
          return err
        }),
    [handleError, router],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

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
    createSettingsFlow(returnTo)
  }, [createSettingsFlow, getSettingsFlow, flowId, returnTo, router.isReady])

  const onSubmit = (values: UpdateSettingsFlowBody) =>
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
      })

  // if the flow is not set, we show a loading indicator
  return flow ? (
    // create a settings form that dynamically renders based on the flow data using Ory Elements
    // This card is more complicated, as it is dynamically rendered based on the flow data from your Ory Console project.

    <div id="settingsForm" className={gridStyle({ gap: 16 })}>
      {/* Show a success message if the user changed their password */}
      <NodeMessages uiMessages={flow.ui.messages} />
      {/* here we simply map all of the settings flows we could have. These flows won't render if they aren't enabled inside your Ory Network project */}
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookupSecret",
          "oidc",
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
  ) : (
    <div>Loading...</div>
  )
}

Settings.getLayout = (page) => <Layout>{page}</Layout>

export default Settings
