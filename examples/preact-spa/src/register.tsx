import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Register = () => {
  const [flow, setFlow] = useState<RegistrationFlow | null>(null)

  const [location, setLocation] = useLocation()

  useEffect(() => {
    sdk
      .createBrowserRegistrationFlow()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch((error) => console.error(error))
  }, [])

  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"registration"}
      title={"Registration"}
      additionalProps={{
        loginURL: "/login",
      }}
      includeScripts={true}
      onSubmit={({ body }) => {
        sdk
          .updateRegistrationFlow(flow.id, body as UpdateRegistrationFlowBody)
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
