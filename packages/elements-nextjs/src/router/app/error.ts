import { init, initOverrides, onRedirect, QueryParams, toValue } from "./utils"
import { FlowType, FlowError, handleFlowError ,FrontendApi} from "@ory/client-fetch"

/**
 * Use this method in an app router page to fetch an existing flow error. This method works with server-side rendering.
 *
 * ```
 * import { getOrCreateErrorFlow } from "$/elements/frameworks/nextjs/routers/app/error"
 * import { Error } from "$/elements/headless/flows/error"
 *
 * export default async function ErrorPage({ searchParams }: PageProps) {
 *   const flow = await getFlowError(searchParams)
 *
 *   return (
 *     <Error
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
export function getFlowError(client: FrontendApi): (params: QueryParams) => Promise<FlowError> {
  return async (params: QueryParams) => {
    // Restart in an error scenario happens when the error does not exist or is expired. In that case there is
    // nothing to do but try to sign in, which will redirect us if we're already logged in.
    const onRestartFlow = () => init(params, FlowType.Login)
    if (!params.id) {
      return onRestartFlow()
    }

    try {
      const response = await client.getFlowErrorRaw(
        {
          id: params.id,
        },
        initOverrides,
      )
      return toValue(response)
    } catch (error) {
      const errorHandler = handleFlowError({
        onValidationError: () => onRestartFlow(),
        onRestartFlow,
        onRedirect,
      })
      await errorHandler(error)
      return null
    }
  }
}
