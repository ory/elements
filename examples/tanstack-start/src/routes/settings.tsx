// SPDX-License-Identifier: Apache-2.0

import { SessionProvider } from "@ory/elements-react/client"
import { Settings } from "@ory/elements-react/theme"
import type { QueryParams } from "@ory/tanstack-start"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { FlowLayout } from "../flow-layout"
import { withSdkUrl } from "../ory.config"
import { getOry } from "../ory.server"
import { validateOrySearch } from "../search"

const loadSettingsFlow = createServerFn({ method: "GET" })
  .inputValidator((params: QueryParams) => params)
  .handler(async ({ data: params }) => {
    const request = getRequest()
    const ory = getOry()
    const flow = await ory.getSettingsFlow({ request, params })
    return {
      flow,
      sdkUrl: ory.getBrowserSdkUrl({ request }),
      session: await ory.getSession({ request }),
    }
  })

export const Route = createFileRoute("/settings")({
  validateSearch: validateOrySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadSettingsFlow({ data: deps }),
  component: SettingsPage,
})

function SettingsPage() {
  const { flow, sdkUrl, session } = Route.useLoaderData()
  if (!flow) return null

  return (
    <FlowLayout>
      <SessionProvider session={session} baseUrl={sdkUrl}>
        <Settings
          flow={flow}
          config={withSdkUrl(sdkUrl)}
          components={{ Card: {} }}
        />
      </SessionProvider>
    </FlowLayout>
  )
}
