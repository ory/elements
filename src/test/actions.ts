import { FrontendApi } from "@ory/client"
import { Traits } from "./types"

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
