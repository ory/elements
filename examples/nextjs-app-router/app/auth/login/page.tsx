import { Login } from "@ory/elements-react/theme"
import { useOryConfig } from "@/nextjs"
import { getLoginFlow, OryPageParams } from "@/nextjs/app"

import config from "@/ory.config"
import CardHeader from "@/app/auth/login/card-header"

export default async function LoginPage({ searchParams }: OryPageParams) {
  const flow = await getLoginFlow(searchParams)

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
