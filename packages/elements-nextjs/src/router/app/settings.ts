import {
  init,
  initOverrides,
  onRedirect,
  onValidationError,
  QueryParams,
  requestParams,
  toValue,
} from "$/elements/frameworks/nextjs/routers/app/utils"
import { serverClientFrontend } from "$/utils/sdk"
import { SettingsFlow } from "@ory-corp/client"
import { FlowType, handleFlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing settings flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateSettingsFlow } from "$/elements/frameworks/nextjs/routers/app/settings"
 * import { Settings } from "$/elements/headless/flows/settings"
 *
 * export default async function SettingsPage({ searchParams }: PageProps) {
 *   const flow = await getOrCreateSettingsFlow(searchParams)
 *
 *   return (
 *     <Settings
 *       flow={flow}
 *       config={{
 *         name: "My Project",
 *         sdk: { url: "https://<project.slug>.projects.oryapis.com" },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param params The query parameters of the request.
 */
export async function getOrCreateSettingsFlow(
  params: QueryParams,
): Promise<SettingsFlow | null> {
  const onRestartFlow = () => init(params, FlowType.Settings)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const response = await serverClientFrontend().getSettingsFlowRaw(
      requestParams(params),
      initOverrides,
    )
    return toValue(response)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect,
    })
    errorHandler(error)
    return null
  }
}
