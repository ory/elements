import React from "react"
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/client"
import { useEffect, useState } from "react"
import { SelfServiceAuthCard } from "@ory/elements"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Registration = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    sdk
      .initializeSelfServiceRegistrationFlowForBrowsers()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch((error) => console.error(error))
  }, [])

  return flow ? (
    <SelfServiceAuthCard
      flow={flow}
      flowType={"registration"}
      title={"Registration"}
      additionalProps={{
        loginURL: "/login",
      }}
      onSubmit={({ body }) => {
        sdk
          .submitSelfServiceRegistrationFlow(
            flow.id,
            body as SubmitSelfServiceRegistrationFlowBody,
          )
          .then(() => {
            // we successfully submitted the login flow, so lets redirect to the dashboard
            navigate("/", { replace: true })
          })
          .catch((error) => {
            setFlow(error.response.data)
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}
