import { SelfServiceRegistrationFlow } from "@ory/client"
import { useEffect, useState } from "react"
import { SelfServiceAuthCard } from "../../../dist"
import sdk from "./sdk"

export const Registration = () => {
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | null>(null)
  const [activeFlow, setActiveFlow] =
    useState<"password" | "passwordless">("password")

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
    />
  ) : (
    <div>Loading...</div>
  )
}
