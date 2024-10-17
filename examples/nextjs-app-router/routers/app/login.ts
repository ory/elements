import {
  redirectToBrowserEndpoint,
  initOverrides,
  onRedirect,
  onValidationError,
  QueryParams,
  toFlowParams,
  toValue,
} from "./utils"
import {LoginFlow, FlowType, handleFlowError, FrontendApi} from "@ory/client-fetch"

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
 * @param client The client to use for the request.
 */
export async function getOrCreateLoginFlow(
  params: QueryParams,
  client: FrontendApi
): Promise<LoginFlow | null> {
  const onRestartFlow = () => redirectToBrowserEndpoint(params, FlowType.Login)
  if (!params.flow) {
    return onRestartFlow()
  }

  try {
    const resp = await client.getLoginFlowRaw(
      toFlowParams(params),
      initOverrides,
    )

    return toValue(resp)
  } catch (error) {
    const errorHandler = handleFlowError({
      onValidationError,
      onRestartFlow,
      onRedirect,
    })
    await errorHandler(error)
    return null
  }
}
