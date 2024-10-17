import { Login } from "@ory/elements-react/theme"
import { getOrCreateLoginFlow } from "@/next/router/app"

import { useOryConfig, newFrontendClient } from "@/next"
import config from "@/ory.config"
import CardHeader from "@/app/auth/login/card-header"

const client = newFrontendClient()

export default async function LoginPage({
  searchParams,
}: {
  searchParams: URLSearchParams
}) {
  const flow = await getOrCreateLoginFlow(searchParams, client)

  if (!flow) {
    return null
  }

  return (
    <Login
      flow={flow}
      config={useOryConfig(config)}
      components={{
        Card: {
          Header: CardHeader,
        },
      }}
    />
  )
}
