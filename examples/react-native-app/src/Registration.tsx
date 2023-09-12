import { Text, View } from "react-native"
import { RootStackParamList } from "./App"
import { StackScreenProps } from "@react-navigation/stack"
import { IntlProvider, ThemeProvider, UserAuthCard } from "@ory/elements"
import { useCallback, useContext, useState } from "react"
import {
  ContinueWithSetOrySessionToken,
  ContinueWithVerificationUi,
  RegistrationFlow,
  UpdateRegistrationFlowBody,
} from "@ory/client"
import { ProjectContext } from "./ProjectProvider"
import { AuthContext } from "./AuthProvider"
import { useFocusEffect } from "@react-navigation/native"
import { SessionContext } from "./helpers/auth"

type Props = StackScreenProps<RootStackParamList, "Registration">

export const Registration = ({ navigation }: Props) => {
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { setSession, isAuthenticated } = useContext(AuthContext)
  const { sdk } = useContext(ProjectContext)

  const initializeFlow = () =>
    sdk
      .createNativeRegistrationFlow({
        returnTo: "http://localhost:19006/Callback",
        returnSessionTokenExchangeCode: true,
      })
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setFlow(flow)
        console.log("Setting registration flow", flow)
      })
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        navigation.navigate("Home")
        return
      }
      initializeFlow()

      return () => setFlow(undefined)
    }, []),
  )

  const refetchFlow = () =>
    sdk
      .getRegistrationFlow({ id: flow?.id || "" })
      .then(({ data: f }) => setFlow({ ...flow, ...f })) // merging ensures we don't lose the code
      .catch(console.error)

  const onSubmit = async (
    payload: UpdateRegistrationFlowBody,
  ): Promise<void> => {
    if (!flow) {
      return
    }

    sdk
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: payload,
      })
      .then(({ data }) => {
        // ORY Kratos can be configured in such a way that it requires a login after
        // registration. You could handle that case by navigating to the Login screen
        // but for simplicity we'll just print an error here:
        if (!data.session_token || !data.session) {
          const err = new Error(
            "It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration",
          )
          return Promise.reject(err)
        }

        const s: SessionContext = {
          session: data.session,
          session_token: data.session_token,
        }

        let verificationFlow = false
        if (data.continue_with) {
          for (const c of data.continue_with) {
            switch (c.action) {
              case "show_verification_ui": {
                console.log("got a verfification flow, navigating to it", c)
                verificationFlow = true
                navigation.navigate("Verification", {
                  flowId: (c as ContinueWithVerificationUi).flow.id,
                })
                break
              }
              case "set_ory_session_token": {
                // Right now, this is redundant, and is just supposed to show that the session token is also included
                // in the continue_with elements.
                console.log(
                  "found an ory session token, storing it for further use",
                )
                s.session_token = (
                  c as ContinueWithSetOrySessionToken
                ).ory_session_token
                break
              }
            }
          }
        }

        // Let's log the user in!
        setSession(s)
        if (!verificationFlow) {
          navigation.navigate("Home")
        }
      })
      .catch((err) => refetchFlow())
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {flow ? (
        <ThemeProvider>
          <IntlProvider>
            <UserAuthCard
              flow={flow}
              flowType="registration"
              onSubmit={({ body }) =>
                onSubmit(body as UpdateRegistrationFlowBody)
              }
              additionalProps={{
                loginURL: {
                  href: "",
                  handler: () => navigation.navigate("Login", {}),
                },
              }}
            />
          </IntlProvider>
        </ThemeProvider>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}
