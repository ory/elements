// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Registration } from "@ory/elements-react/theme"
import {
  useRegistrationFlow,
} from "@ory/nextjs/pages"
import { useOryConfig } from "@ory/nextjs"

import config from "@/ory.config"

export default function LoginPage() {
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
