import { IntlProvider, ThemeProvider, UserAuthCard } from "@ory/elements"
import { useCallback, useContext, useState } from "react"
import { ProjectContext } from "./ProjectProvider"
import { AuthContext } from "./AuthProvider"
import { LoginFlow, UpdateLoginFlowBody } from "@ory/client"
import { useFocusEffect } from "@react-navigation/native"
import { SessionContext } from "./helpers/auth"
import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "./App"
import { Text, View } from "react-native"

type Props = StackScreenProps<RootStackParamList, "Login">

const Login = ({ navigation, route }: Props) => {
  const { sdk } = useContext(ProjectContext)
  const { setSession, sessionToken } = useContext(AuthContext)
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)

  const initializeFlow = () =>
    sdk
      .createNativeLoginFlow({
        aal: route.params.aal,
        refresh: route.params.refresh,
        xSessionToken: sessionToken,
        returnTo: "http://localhost:19006/Callback",
        returnSessionTokenExchangeCode: true,
      })
      .then(({ data: f }) => setFlow(f))
      .catch(console.error)

  const refetchFlow = () =>
    sdk
      .getLoginFlow({ id: flow?.id || "" })
      .then(({ data: f }) => setFlow({ ...flow, ...f })) // merging ensures we don't lose the code
      .catch(console.error)

  // When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [route.params]),
  )

  const setSessionAndRedirect = (session: SessionContext) => {
    setSession(session)
    setTimeout(() => {
      navigation.navigate("Home")
    }, 100)
  }

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: UpdateLoginFlowBody) =>
    flow
      ? sdk
        .updateLoginFlow({
          flow: flow.id,
          updateLoginFlowBody: payload,
          xSessionToken: sessionToken,
        })
        .then(({ data }) => Promise.resolve(data as SessionContext))
        // Looks like everything worked and we have a session!
        .then(setSessionAndRedirect)
        .catch((err) => {
          console.error(err)
        })
      : Promise.resolve()

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
              flowType="login"
              onSubmit={({ body }) => onSubmit(body as UpdateLoginFlowBody)}
              additionalProps={{
                signupURL: {
                  href: "",
                  handler: () => navigation.navigate("Registration"),
                },
                logoutURL: {
                  href: "",
                  // TODO: change me!
                  handler: () => navigation.navigate("Home"),
                },
                forgotPasswordURL: {
                  href: "",
                  handler: () => navigation.navigate("Recovery"),
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

export default Login
