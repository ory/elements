// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FrontendApi } from "@ory/client"
import { Traits } from "../models/types"

export const registerAccount = async (
  sdk: FrontendApi,
  traits: Record<string, Traits>,
) => {
  sdk
    .createBrowserRegistrationFlow()
    .then(({ data: flow }) => {
      return sdk.updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          method: "password",
          traits: traits,
        },
      })
    })
    .then((resp) =>
      resp.status === 200 ? resp.data : Promise.reject(resp.data),
    )
}
