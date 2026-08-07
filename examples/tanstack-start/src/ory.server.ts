// SPDX-License-Identifier: Apache-2.0

import { createOry } from "@ory/tanstack-start/server"
import config from "./ory.config"

let instance: ReturnType<typeof createOry> | undefined

export function getOry() {
  if (instance) return instance

  const sdkUrl = process.env["ORY_SDK_URL"]
  if (!sdkUrl) {
    throw new Error("Set ORY_SDK_URL to your Ory Network SDK URL")
  }

  instance = createOry({
    sdkUrl,
    serverSdkUrl: process.env["ORY_SERVER_SDK_URL"],
    appUrl: process.env["APP_URL"],
    project: config.project,
  })
  return instance
}
