import { NavigationContainer } from "@react-navigation/native"
import { View } from "react-native"
import { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import Home from "./Home"
import Login from "./Login"
import { createStackNavigator } from "@react-navigation/stack"
import { Registration } from "./Registration"

// Ory Elements
// optional icons
import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"
// optional fonts
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"
//
// required styles for Ory Elements
import "@ory/elements/style.css"
import { defaultLightTheme } from "@ory/elements"

export type RootStackParamList = {
  Home: undefined
  Login: {
    refresh?: boolean
    aal?: "aal2"
  }
  Registration: undefined
  Settings: {
    flowId?: string
  }
  Callback: {
    code?: string
  }
  Verification: {
    flowId?: string
  }
  Recovery: undefined
}

const Stack = createStackNavigator<RootStackParamList>()

const linking = {
  // This is only used for e2e testing.
  prefixes: ["http://127.0.0.1:19006/"],
}

export default function App() {
  const { isAuthenticated } = useContext(AuthContext)

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer
        linking={linking}
        theme={{
          colors: {
            background: defaultLightTheme.background.surface,
            border: defaultLightTheme.border.def,
            card: defaultLightTheme.background.surface,
            notification: defaultLightTheme.background.canvas,
            primary: defaultLightTheme.accent.def,
            text: defaultLightTheme.accent.emphasis,
          },
          dark: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} initialParams={{}} />
            <Stack.Screen name="Registration" component={Registration} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </View>
  )
}
