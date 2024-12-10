// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from "@ory/client-fetch"
import { serverSideFrontendClient } from "./client"
import { getCookieHeader } from "./utils"

export async function getServerSession(): Promise<Session | null> {
  const cookie = await getCookieHeader()
  return serverSideFrontendClient
    .toSession({
      cookie,
    })
    .catch(() => null)
}
