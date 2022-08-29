import React, { useEffect, useState } from "react"
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"
import { SelfServiceAuthCard } from "@ory/elements"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Login = (): JSX.Element => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    sdk
      .initializeSelfServiceLoginFlowForBrowsers(true)
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
            navigate("/", { replace: true })
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
