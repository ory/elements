import {
  RegistrationFlow,
  FlowType,
  handleFlowError,
  FrontendApi,
} from "@ory/client-fetch"
import { FlowParams, initOverrides, QueryParams } from "./types"
import { onValidationError, toValue } from "./utils"

export function useRegistrationFlowFactory(factory: {
  redirectToBrowserEndpoint: (params: QueryParams, flowType: FlowType) => void
  onRedirect: (url: string, external: boolean) => void
  toFlowParams: (params: QueryParams) => FlowParams
}): (
  params: QueryParams,
  client: FrontendApi,
) => Promise<RegistrationFlow | null | void> {
  return async (params: QueryParams, client: FrontendApi) => {
    const onRestartFlow = () =>
      factory.redirectToBrowserEndpoint(params, FlowType.Registration)

    if (!params["flow"]) {
      onRestartFlow()
      return
    }

    try {
      const resp = await client.getRegistrationFlowRaw(
        factory.toFlowParams(params),
        initOverrides,
      )

      return toValue(resp)
    } catch (error) {
      const errorHandler = handleFlowError({
        onValidationError,
        onRestartFlow,
        onRedirect: factory.onRedirect,
      })
      await errorHandler(error)
      return null
    }
  }
}
