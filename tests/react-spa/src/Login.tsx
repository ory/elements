import React, { useCallback, useEffect, useState } from "react"
import {
  SelfServiceLoginFlow,
  SubmitSelfServiceLoginFlowBody,
} from "@ory/client"
import { OIDCSection, PasswordlessSection, UserAuthCard } from "@ory/elements"
import sdk from "./sdk"
import { useNavigate, useSearchParams } from "react-router-dom"

export const Login = (): JSX.Element => {
  const [flow, setFlow] = useState<SelfServiceLoginFlow | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const aal2 = searchParams.get("aal2")

  const isMFA = aal2 ? true : false

  const navigate = useNavigate()

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
            return navigate("/login", { replace: true })
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
            navigate("/", { replace: true })
          })
          .catch((error) => {
            switch (error.response.status) {
              case 400:
                setFlow(error.response.data)
                break
              case 410:
              case 404:
                return navigate("/login", { replace: true })
            }
          })
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}
