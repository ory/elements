// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, FrontendApi } from "@ory/client"

export class ApiHelpers {
  readonly sdk: FrontendApi

  constructor(baseUrl: string) {
    this.sdk = new FrontendApi(
      new Configuration({
        basePath: baseUrl,
        baseOptions: {
          withCredentials: true,
        },
      }),
    )
  }
}
