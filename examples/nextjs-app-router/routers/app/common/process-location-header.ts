export function processLocationHeader(
  locationHeaderValue: string,
  baseUrl: string,
  basePath: string = "",
) {
  if (locationHeaderValue.startsWith(baseUrl)) {
    return locationHeaderValue.replace(baseUrl, basePath.replace(/\/$/, ""))
  }

  return locationHeaderValue
}
