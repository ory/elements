// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FrontendApi, Configuration } from "@ory/client"

export default new FrontendApi(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath: import.meta.env.VITE_ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    },
  }),
)
