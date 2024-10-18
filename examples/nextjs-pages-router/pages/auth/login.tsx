import { Registration } from "@ory/elements-react/theme"
import { useRegistrationFlow } from "nextjs-app-router/nextjs/pages"

import { useOryConfig, newFrontendClient } from "nextjs-app-router/nextjs"
import config from "nextjs-app-router/ory.config"
import { handleFlowError } from "@ory/client-fetch"
import { GetServerSidePropsContext } from "next"
import { toValue } from "nextjs-app-router/nextjs/utils"

const client = newFrontendClient()

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams: URLSearchParams
}) {
  const flow = await useRegistrationFlow(searchParams, client)

  if (!flow) {
    return null
  }

  return (
    <Registration
      flow={flow}
      config={useOryConfig(config)}
      components={{
        Card: {},
      }}
    />
  )
}
