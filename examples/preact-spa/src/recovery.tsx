import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import { useLocation } from "wouter"
import sdk from "./sdk"

export const Recovery = () => {
  const [flow, setFlow] = useState<RecoveryFlow | null>(null)

  const [location, setLocation] = useLocation()

  useEffect(() => {
    sdk
      .createBrowserRecoveryFlow()
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
          .updateRecoveryFlow({
            flow: flow.id,
            updateRecoveryFlowBody: body as UpdateRecoveryFlowBody,
          })
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
