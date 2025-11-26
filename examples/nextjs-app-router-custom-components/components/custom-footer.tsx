/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison -- eslint gets confused because of different versions of @ory/client-fetch */
import { FlowType } from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import Link from "next/link"

export function MyCustomFooter() {
  const flow = useOryFlow()

  switch (flow.flowType) {
    case FlowType.Login:
      return (
        <>
          Don't have an account?{" "}
          <Link href="/auth/registration">Register here</Link>
        </>
      )
    case FlowType.Registration:
      return (
        <>
          Already have an account? <Link href="/auth/login">Login here</Link>
        </>
      )
    case FlowType.Recovery:
      return (
        <>
          Remembered your password? <Link href="/auth/login">Login here</Link>
        </>
      )
    case FlowType.Verification:
      return null
    case FlowType.OAuth2Consent:
      return null
    default:
      return null
  }
}
