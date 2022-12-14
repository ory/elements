// React
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

// Ory SDK
import { ory } from "../components/sdk"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"

import { AxiosError } from "axios"
import type { NextPage } from "next"

import {
  gridStyle,
  UserSettingsCard,
  UserSettingsFlowType,
} from "@ory/elements"

import React from "react"
import Link from "next/link"

const Settings: NextPage = () => {
  const [flow, setFlow] = useState<SettingsFlow>()

  // Get ?flow=... from the URL
  const router = useRouter()
  const { flow: flowId, return_to: returnTo } = router.query

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSettingsFlow({ id: String(flowId) })
        .then(({ data }) => {
          setFlow(data)
        })
        .catch(async (err: AxiosError) => {
          if (err.response?.status === 400) {
            setFlow(err.response?.data)
            return
          }

          return Promise.reject(err)
        })
      return
    }

    // Otherwise we initialize it
    ory
      .createBrowserSettingsFlow({
        returnTo: returnTo ? String(returnTo) : undefined,
      })
      .then(({ data }) => {
        setFlow(data)
      })
      .catch(async (err: AxiosError) => {
        // If the previous handler did not catch the error it's most likely a form validation error
        if (err.response?.status === 400) {
          // Yup, it is!
          setFlow(err.response?.data)
          return
        }

        return Promise.reject(err)
      })
  }, [flowId, router, router.isReady, returnTo, flow])

  const onSubmit = (values: UpdateSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
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
          .catch(async (err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data)
              return
            }

            return Promise.reject(err)
          }),
      )

  // if the flow is not set, we show a loading indicator
  return flow ? (
    // create a login form that dynamically renders based on the flow data using Ory Elements
    <>
      <h1>
        <Link href="/">Home</Link>
      </h1>
      <div className={gridStyle({ gap: 16 })}>
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
