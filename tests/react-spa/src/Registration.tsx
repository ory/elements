import React from "react"
import {
  SelfServiceRegistrationFlow,
  SubmitSelfServiceRegistrationFlowBody,
} from "@ory/client"
import { useEffect, useState } from "react"
import { SelfServiceAuthCard } from "@ory/themes"
import sdk from "./sdk"
import { useNavigate } from "react-router-dom"

export const Registration = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | null>(null)
  const [activeFlow, setActiveFlow] =
    useState<"password" | "passwordless">("password")

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
      activeFlow={activeFlow}
      selectActiveFlowAction={(e) => {
        setActiveFlow(activeFlow === "password" ? "passwordless" : "password")
      }}
      additionalProps={{
        loginURL: "/login",
      }}
      onFormSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        // map the entire form data to JSON for the request body
        const body: SubmitSelfServiceRegistrationFlowBody = Object.fromEntries(
          formData,
        ) as never as SubmitSelfServiceRegistrationFlowBody

        // We need the method from which is specified as a name and value on the submit button
        body.method = (
          event.currentTarget.elements.namedItem("method") as HTMLInputElement
        ).value

        sdk
          .submitSelfServiceRegistrationFlow(flow.id, body)
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
