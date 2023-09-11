import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLoadedAssets } from "./hooks/useLoadAssets";
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import Home from './Home';
import Login from './Login';
import { createStackNavigator } from '@react-navigation/stack';
import { IntlProvider, ThemeProvider } from '@ory/elements';

// Ory Elements
// optional global css reset
// import "@ory/elements/assets/normalize.css"
// optional fontawesome icons

// import "@ory/elements/assets/fa-brands.min.css"
// import "@ory/elements/assets/fa-solid.min.css"
// import "@ory/elements/assets/fontawesome.min.css"
//
// // optional fonts
// import "@ory/elements/assets/inter-font.css"
// import "@ory/elements/assets/jetbrains-mono-font.css"
//
// required styles for Ory Elements
import "@ory/elements/style.css"

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

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  // This is only used for e2e testing.
  prefixes: ["http://127.0.0.1:19006/"],
}

export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const { isAuthenticated } = useContext(AuthContext)

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ThemeProvider>
        <IntlProvider>
          <View className="container mx-auto h-12 justify-center bg-slate-300 items-center">

            <KeyboardAvoidingView
              // style={{ flex: 1 }}
              behavior={Platform.OS == "ios" ? "padding" : "height"}
            >
              <SafeAreaProvider>

                <NavigationContainer linking={linking}>

                  <View className="flex flex-1 items-center justify-center">
                    <Stack.Navigator
                      screenOptions={{
                        headerShown: isAuthenticated,
                      }}
                      initialRouteName='Home'
                    >
                      <Stack.Screen name="Home" component={Home} />
                      <Stack.Screen name="Login" component={Login} initialParams={{}} />
                      {/* <Stack.Screen */}
                      {/*   name="Settings" */}
                      {/*   component={Settings} */}
                      {/*   options={options} */}
                      {/* /> */}
                      {/* <Stack.Screen name="Registration" component={Registration} /> */}
                      {/* <Stack.Screen name="Login" component={Login} initialParams={{}} /> */}
                      {/* <Stack.Screen name="Verification" component={Verification} /> */}
                      {/* <Stack.Screen name="Callback" component={Callback} /> */}
                      {/* <Stack.Screen name="Recovery" component={Recovery} /> */}
                    </Stack.Navigator>
                    <StatusBar />
                  </View>
                </NavigationContainer>

              </SafeAreaProvider>
            </KeyboardAvoidingView>
          </View>
        </IntlProvider>
      </ThemeProvider >

    );
  }
}
