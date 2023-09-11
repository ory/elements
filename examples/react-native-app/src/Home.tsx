import { useContext, useEffect } from "react"
import { AuthContext } from "./AuthProvider"
import { useNavigation } from "@react-navigation/native"
import { Text } from "react-native"

const Home = () => {
  const navigation = useNavigation()
  const { isAuthenticated, session, sessionToken } = useContext(AuthContext)

  useEffect(() => {
    if (!isAuthenticated || !session) {
      navigation.navigate("Login")
    }
  }, [isAuthenticated, sessionToken])

  if (!isAuthenticated || !session) {
    return null
  }

  // Get the name, or if it does not exist in the traits, use the
  // identity's ID
  const { name: { first = String(session.identity?.id) } = {} } = session
    .identity?.traits as { name: { first?: string } }

  return (
    <div>
      <div>
        <Text style={{ marginBottom: 14 }}>
          Welcome back, {first}!
        </Text>
        <Text>
          Hello, nice to have you! You signed up with this data:
        </Text>
        <pre>
          <code>
            {JSON.stringify(session.identity?.traits || "{}", null, 2)}
          </code>
        </pre>
        <div>
          You are signed in using an ORY Kratos Session Token:
        </div>
        <div>{sessionToken}</div>
        <p>
          This app makes REST requests to ORY Kratos&apos; Public API to validate and
          decode the ORY Kratos Session payload:
        </p>
        <pre>
          <code>
            {JSON.stringify(session || "{}", null, 2)}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default Home
