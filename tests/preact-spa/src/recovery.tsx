import {
  SelfServiceRecoveryFlow,
  SubmitSelfServiceRecoveryFlowBody,
} from "@ory/client"
import { SelfServiceAuthCard } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import { useLocation } from "wouter"
import sdk from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<SelfServiceRecoveryFlow | null>(null)

  const [location, setLocation] = useLocation()

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
    <SelfServiceAuthCard
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
            setLocation("/", { replace: true })
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
