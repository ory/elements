// SPDX-License-Identifier: Apache-2.0

import { Error as ErrorComponent } from "@ory/elements-react/theme"
import type { QueryParams } from "@ory/tanstack-start"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { FlowLayout } from "../../flow-layout"
import { withSdkUrl } from "../../ory.config"
import { getOry } from "../../ory.server"
import { validateOrySearch } from "../../search"

const loadError = createServerFn({ method: "GET" })
  .inputValidator((params: QueryParams) => params)
  .handler(async ({ data: params }) => {
    const request = getRequest()
    const ory = getOry()
    return {
      error: await ory.getError({ params }),
      sdkUrl: ory.getBrowserSdkUrl({ request }),
      session: await ory.getSession({ request }).catch(() => null),
    }
  })

export const Route = createFileRoute("/auth/error")({
  validateSearch: validateOrySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadError({ data: deps }),
  component: ErrorPage,
})

function ErrorPage() {
  const { error, sdkUrl, session } = Route.useLoaderData()

  return (
    <FlowLayout>
      <ErrorComponent
        error={error}
        config={withSdkUrl(sdkUrl)}
        components={{ Card: {} }}
        session={session ?? undefined}
      />
    </FlowLayout>
  )
}
