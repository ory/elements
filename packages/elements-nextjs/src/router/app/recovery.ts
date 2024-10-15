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
import { RecoveryFlow } from "@ory-corp/client"
import { FlowType, handleFlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing recovery flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateRecoveryFlow } from "$/elements/frameworks/nextjs/routers/app/recovery"
 * import { Recovery } from "$/elements/headless/flows/recovery"
 *
 * export default async function RecoveryPage({ searchParams }: PageProps) {
 *   const flow = await getOrCreateRecoveryFlow(searchParams)
 *
 *   return (
 *     <Recovery
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
export async function getOrCreateRecoveryFlow(
  params: QueryParams,
): Promise<RecoveryFlow | null> {
  const onRestartFlow = () => init(params, FlowType.Recovery)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const response = await serverClientFrontend().getRecoveryFlowRaw(
      requestParams(params),
      initOverrides,
    )
    return toValue<RecoveryFlow>(response)
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
