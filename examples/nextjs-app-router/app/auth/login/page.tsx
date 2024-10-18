import { Login } from "@ory/elements-react"
import { useOryConfig } from "@ory/nextjs"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/dist/src/app"
import "@ory/elements-react/theme/styles.css"

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
