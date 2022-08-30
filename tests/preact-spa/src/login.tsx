import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"
import { UserAuthCard } from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import sdk from "./sdk"
import { useLocation } from "wouter"

export const Login = () => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)

  const [location, setLocation] = useLocation()

  const handleFlow = useCallback(
    ({ refresh, mfa }: { refresh: boolean; mfa: boolean }) => {
      return sdk
        .initializeSelfServiceLoginFlowForBrowsers(
          refresh,
          mfa ? "aal2" : "aal1",
        )
        .then(({ data: flow }) => flow)
    },
    [],
  )

  useEffect(() => {
    const aal2 = new URLSearchParams(
      new URL(window.location.toString()).search,
    ).get("aal2")

    const isMFA = aal2 ? true : false
    handleFlow({ refresh: true, mfa: isMFA })
      .then((flow) => setFlow(flow))
      .catch((error) => {
        console.dir({ error: error.response })
        switch (error.response?.status) {
          case 400:
            setFlow(error.response.data)
            break
          case 410:
          case 404:
            return setLocation("/login", { replace: true })
        }
      })
  }, [])

  return flow ? (
    <UserAuthCard
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
