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
import { LoginFlow } from "@ory-corp/client"
import { FlowType, handleFlowError } from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateLoginFlow } from "$/elements/frameworks/nextjs/routers/app/login"
 * import { Login } from "$/elements/headless/flows/login"
 *
 * export default async function LoginPage({ searchParams }: PageProps) {
 *   const flow = await getOrCreateLoginFlow(searchParams)
 *
 *   return (
 *     <Login
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
export async function getOrCreateLoginFlow(
  params: QueryParams,
): Promise<LoginFlow | null> {
  const onRestartFlow = () => init(params, FlowType.Login)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const resp = await serverClientFrontend().getLoginFlowRaw(
      requestParams(params),
      initOverrides,
    )

    return toValue(resp)
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
