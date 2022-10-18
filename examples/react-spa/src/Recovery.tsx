import React from "react"
import {
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody,
} from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useEffect, useState } from "react"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Recovery = () => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    sdk
      .initializeSelfServiceRecoveryFlowForBrowsers()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return flow ? (
    <UserAuthCard
      title="Recovery"
      flow={flow}
      flowType={"recovery"}
      additionalProps={{ loginURL: "/login" }}
      onSubmit={({ body }) => {
        sdk
          .submitSelfServiceRecoveryFlow(
            flow.id,
            body as SubmitSelfServiceRecoveryFlowBody,
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
