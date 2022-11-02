// Copyright © 2022 Ory Corp

import { V0alpha2Api, Configuration } from "@ory/client"

export default new V0alpha2Api(
  new Configuration({
    //https://vitejs.dev/guide/env-and-mode.html#env-files
    basePath: import.meta.env.VITE_ORY_SDK_URL,
    baseOptions: {
      withCredentials: true,
    },
  }),
)
