import { Configuration, FrontendApi } from "@ory/client-fetch"

let sdkUrl = process.env.ORY_SDK_URL || ""

export function setSdkUrl(url: string) {
  sdkUrl = url
}

export function getSdkUrl() {
  return sdkUrl
}

export function newFrontendClient() {
  const config = new Configuration({
    headers: {
      Accept: "application/json",
    },
    basePath: getSdkUrl(),
  })
  return new FrontendApi(config)
}
