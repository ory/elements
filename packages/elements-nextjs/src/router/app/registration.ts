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
import { RegistrationFlow } from "@ory-corp/client"
import { FlowType, handleFlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateRegistrationFlow } from "$/elements/frameworks/nextjs/routers/app/registration"
 * import { Registration } from "$/elements/headless/flows/registration"
 *
 * export default async function RegistrationPage({ searchParams }: PageProps) {
 *   const flow = await getOrCreateRegistrationFlow(searchParams)
 *
 *   return (
 *     <Registration
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
export async function getOrCreateRegistrationFlow(
  params: QueryParams,
): Promise<RegistrationFlow | null> {
  const onRestartFlow = () => init(params, FlowType.Registration)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const response = await serverClientFrontend().getRegistrationFlowRaw(
      requestParams(params),
      initOverrides,
    )
    return toValue<RegistrationFlow>(response)
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
