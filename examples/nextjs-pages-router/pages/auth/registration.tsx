// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Registration } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
// import {
//   useRegistrationFlow,
// } from "@ory/nextjs/pages"
import { useOryConfig } from "@ory/nextjs"

import config from "@/ory.config"
import { useRegistrationFlow } from "@/pages/auth/hook"

export default function RegistrationPage() {
  const flow = useRegistrationFlow()

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
