import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"
import { SelfServiceAuthCard } from "@ory/elements-preact"
import { useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Login = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)

  const [location, setLocation] = useLocation()

  useEffect(() => {
    sdk
      .initializeSelfServiceLoginFlowForBrowsers()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  return flow ? (
    <SelfServiceAuthCard
      flow={flow}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/recovery",
        signupURL: "/signup",
      }}
      title={"Login"}
      injectScripts={true}
      onSubmit={({ body }) => {
        sdk
          .submitSelfServiceLoginFlow(
            flow.id,
            body as SubmitSelfServiceLoginFlowBody,
          )
          .then(() => {
            // we successfully submitted the login flow, so lets redirect to the dashboard
            setLocation("/", { replace: true })
          })
          .catch((error) => {
            console.error({ error })
            setFlow(error.response.data)
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}
