import { Login } from "@ory/elements-react/theme"
import config from "@/app/(ory)/config"
import { getOrCreateLoginFlow } from "@/routers/app/login"
import { newFrontendClient } from "@/fetch/sdk"

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
