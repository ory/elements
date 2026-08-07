// SPDX-License-Identifier: Apache-2.0

import {
  createCsrfMiddleware,
  createIsomorphicFn,
  createStart,
} from "@tanstack/react-start"
import { createOryMiddleware } from "@ory/tanstack-start/middleware"
import config from "./ory.config"

const getRequestMiddleware = createIsomorphicFn()
  .client(() => [])
  .server(() => {
    const sdkUrl = process.env["ORY_SDK_URL"]
    if (!sdkUrl) {
      throw new Error("Set ORY_SDK_URL to your Ory Network SDK URL")
    }

    return [
      createOryMiddleware({
        sdkUrl,
        serverSdkUrl: process.env["ORY_SERVER_SDK_URL"],
        appUrl: process.env["APP_URL"],
        project: config.project,
        projectApiToken: process.env["ORY_PROJECT_API_TOKEN"],
      }),
      createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" }),
    ]
  })

export const startInstance = createStart(() => ({
  requestMiddleware: getRequestMiddleware(),
}))
