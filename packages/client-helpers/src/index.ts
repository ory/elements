import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
} from "@ory/client-fetch"

export function frontendClient(
  sdkUrl: string,
  opts: Partial<ConfigurationParameters> = {},
) {
  const config = new Configuration({
    ...opts,
    basePath: sdkUrl,
    headers: {
      Accept: "application/json",
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}

export * from "./error"
export * from "./onSubmitLogin"
export * from "./onSubmitSettings"
export * from "./urlHelpers"
export * from "./configuration"
export * from "./flowTypes"
export * from "./onSubmitRecovery"
export * from "./onSubmitVerification"
export * from "./utils"
export * from "./continueWith"
export * from "./index"
export * from "./onSubmitRegistration"
export * from "./ui"
