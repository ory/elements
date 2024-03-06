// React
import Router, { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

// Ory SDK
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"
import { ory } from "@/pkg/sdk"
import { SetUriFlow } from "@/pkg/helpers"

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
import { HandleError } from "@/pkg/hooks"
import { NextPageWithLayout } from "./_app"

const Settings: NextPageWithLayout = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get flow information from the URL
  const router = useRouter()

  const flowId = String(router.query.flow || "")
  const returnTo = String(router.query.return_to || "")

  const getFlow = useCallback(
    (id: string) =>
      ory
        .getSettingsFlow({ id })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(handleError),
    [],
  )

  const handleError = useCallback(
    (error: AxiosError) => {
      const handle = HandleError(getFlow, setFlow, "/settings", true)
      return handle(error)
    },
    [getFlow],
  )

  const createFlow = useCallback(
    (returnTo: string) =>
      ory
        .createBrowserSettingsFlow({
          returnTo,
        })
        .then(({ data }) => {
          setFlow(data)
          SetUriFlow(Router, data.id)
        })
        .catch(handleError),
    [handleError],
  )

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      getFlow(String(flowId || "")).catch(() =>
        createFlow(String(returnTo || "")),
      )
      return
    }

    // Otherwise we initialize it
    createFlow(returnTo)
  }, [router.isReady])

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
      .catch(handleError)

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
          "lookup_secret",
          "oidc",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        // here we render the settings flow using Ory Elements
        <UserSettingsCard
          key={index}
          // we always need to pass the component the flow since it contains the form fields, error messages and csrf token
          flow={flow}
          method={flowType}
          // include scripts for webauthn support
          includeScripts={true}
          // submit the form data the user provides to Ory
          onSubmit={({ body }) => onSubmit(body as UpdateSettingsFlowBody)}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

Settings.getLayout = (page) => <Layout>{page}</Layout>

export default Settings
