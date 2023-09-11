import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParamList } from "./App"
import { useEffect } from "react"
import * as WebBrowser from "expo-web-browser"

type Props = StackScreenProps<RootStackParamList, "Callback">

const Callback = (props: Props) => {
  useEffect(() => {
    WebBrowser.maybeCompleteAuthSession({
      skipRedirectCheck: false,
    })
  }, [])
  return (
    <div>
      {props.route.params?.code ? (
        <>
          Hello Callback! Your code is <code>{props.route.params?.code}</code>
        </>
      ) : (
        <>
          Missing query parameter <code>?code=...</code>
        </>
      )}
    </div>
  )
}

export default Callback
