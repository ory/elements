import { Registration } from "@ory/elements-react/theme"
import {
  useRegistrationFlow,
  getRegistrationServerSideProps,
} from "@ory/nextjs/pages"

import { useOryConfig } from "@ory/nextjs"
import config from "nextjs-app-router/ory.config"

// This gets called on every request
export const getServerSideProps = getRegistrationServerSideProps

export default async function RegistrationPage() {
  const flow = await useRegistrationFlow()

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
