import React, { useEffect, useState } from "react"
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"
import { SelfServiceAuthCard } from "@ory/themes"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Login = (): JSX.Element => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)
  const [activeFlow, setActiveFlow] =
    useState<"password" | "passwordless">("password")

  const navigate = useNavigate()

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
      activeFlow={activeFlow}
      selectActiveFlowAction={(e) => {
        setActiveFlow(activeFlow === "password" ? "passwordless" : "password")
      }}
      title={"Login"}
      injectScripts={true}
      onFormSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        // map the entire form data to JSON for the request body
        const body: SubmitSelfServiceLoginFlowBody = Object.fromEntries(
          formData,
        ) as never as SubmitSelfServiceLoginFlowBody

        // We need the method from which is specified as a name and value on the submit button
        body.method = (
          event.currentTarget.elements.namedItem("method") as HTMLInputElement
        ).value

        sdk
          .submitSelfServiceLoginFlow(flow.id, body)
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
