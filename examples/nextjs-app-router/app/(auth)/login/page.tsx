import { Login } from "@ory/elements-react/theme"
import { getOrCreateLoginFlow } from "@/next/router/app/login"

import { newFrontendClient } from "@/fetch/sdk"
import config from "@/app/(auth)/config"

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

  return <Login flow={flow} config={config} />
}
