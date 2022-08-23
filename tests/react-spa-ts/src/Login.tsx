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
        //const e: FormEvent = event as FormEvent
        console.log({
          method: (
            event.currentTarget.elements.namedItem("method") as HTMLInputElement
          ).value,
        })

        event.preventDefault()

        const form = event.currentTarget
        const formData = new FormData(form)

        let body: SubmitSelfServiceLoginFlowBody = Object.fromEntries(
          formData,
        ) as never as SubmitSelfServiceLoginFlowBody

        body.method = (
          event.currentTarget.elements.namedItem("method") as HTMLInputElement
        ).value

        event.currentTarget.reset()

        sdk
          .submitSelfServiceLoginFlow(flow.id, body)
          .then(({ data }) => {
            navigate("/", { replace: true })
          })
          .catch((error) => {
            // get the flow data and find the error messages
            sdk.getSelfServiceLoginFlow(flow.id).then(({ data }) => {
              setFlow(data)
            })
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}
