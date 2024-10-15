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
import { FlowType, handleFlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing verification flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateVerificationFlow } from "$/elements/frameworks/nextjs/routers/app/verification"
 * import { Verification } from "$/elements/headless/flows/verification"
 *
 * export default async function VerificationPage({ searchParams }: PageProps) {
 *   const flow = await getOrCreateVerificationFlow(searchParams)
 *
 *   return (
 *     <Verification
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
export async function getOrCreateVerificationFlow(params: QueryParams) {
  const onRestartFlow = () => init(params, FlowType.Verification)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const response = await serverClientFrontend().getVerificationFlowRaw(
      requestParams(params),
      initOverrides,
    )
    return toValue(response)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      // RestartFlow and Redirect both use redirects hence we don't need to resolve here.
      onRestartFlow,
      onRedirect,
    })
    errorHandler(error)
    return null
  }
}
