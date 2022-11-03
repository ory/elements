// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, V0alpha2Api } from "@ory/client"

export default new V0alpha2Api(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath: import.meta.env.VITE_ORY_SDK_URL,
    // we always want to include the cookies in each request
    // cookies are used for sessions and CSRF protection
    baseOptions: {
      withCredentials: true,
    },
  }),
)
