// SPDX-License-Identifier: Apache-2.0

import { Verification } from "@ory/elements-react/theme"
import type { QueryParams } from "@ory/tanstack-start"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { FlowLayout } from "../../flow-layout"
import { withSdkUrl } from "../../ory.config"
import { getOry } from "../../ory.server"
import { validateOrySearch } from "../../search"

const loadVerificationFlow = createServerFn({ method: "GET" })
  .inputValidator((params: QueryParams) => params)
  .handler(async ({ data: params }) => {
    const request = getRequest()
    const ory = getOry()
    return {
      flow: await ory.getVerificationFlow({ request, params }),
      sdkUrl: ory.getBrowserSdkUrl({ request }),
    }
  })

export const Route = createFileRoute("/auth/verification")({
  validateSearch: validateOrySearch,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loadVerificationFlow({ data: deps }),
  component: VerificationPage,
})

function VerificationPage() {
  const { flow, sdkUrl } = Route.useLoaderData()
  if (!flow) return null

  return (
    <FlowLayout>
      <Verification
        flow={flow}
        config={withSdkUrl(sdkUrl)}
        components={{ Card: {} }}
      />
    </FlowLayout>
  )
}
