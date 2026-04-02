// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Error as ErrorComponent } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getError, getServerSession, OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function ErrorPage(props: OryPageParams) {
  const error = await getError(props.searchParams)
  const session = await getServerSession().catch(() => null)

  return (
    <ErrorComponent
      error={error}
      config={config}
      components={{ Card: {} }}
      session={session ?? undefined}
    />
  )
}
