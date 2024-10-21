import { Configuration, FrontendApi, ProjectApi } from "@ory/client-fetch"

const sdkUrl = process.env["ORY_SDK_URL"] || ""

function isProduction() {
  return (
    ["production", "prod"].indexOf(
      process.env["VERCEL_ENV"] || process.env["NODE_ENV"] || "",
    ) > -1
  )
}

export function getSdkUrl() {
  if (!isProduction() && process.env["__NEXT_PRIVATE_ORIGIN"]) {
    return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
  }

  if (!isProduction() && process.env["VERCEL_URL"]) {
    return `https://${process.env["VERCEL_URL"]}`.replace(/\/$/, "")
  }

  return sdkUrl.replace(/\/$/, "")
}

export function newOryClient(): {
  frontend: FrontendApi
  project: ProjectApi
} {
  return {
    frontend: newOryFrontendClient(),
    project: newOryProjectClient(),
  }
}

export function newOryFrontendClient() {
  const config = new Configuration({
    headers: {
      Accept: "application/json",
    },
    basePath: getSdkUrl(),
  })
  return new FrontendApi(config)
}

export function newOryProjectClient() {
  const config = new Configuration({
    headers: {
      Accept: "application/json",
    },
    basePath: getSdkUrl(),
    accessToken: process.env["ORY_PROJECT_API_TOKEN"],
  })
  return new ProjectApi(config)
}
