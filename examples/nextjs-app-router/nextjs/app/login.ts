import { onRedirect, redirectToBrowserEndpoint } from "./utils"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import { QueryParams } from "@/nextjs/types"
import { toFlowParams } from "@/nextjs/app/utils"
import { getFlowFactory } from "@/nextjs/app/flow"
import { newFrontendClient } from "@/nextjs"

const factory = getFlowFactory({
  redirectToBrowserEndpoint,
  onRedirect,
  toFlowParams,
  flowType: FlowType.Login,
  fetchFlow: newFrontendClient().getLoginFlowRaw,
})

/**
 * Use this method in an app router page to fetch an existing login flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { useLoginFlow, newFrontendClient } from "@ory/nextjs"
 * import { Login } from "@ory/elements/headless/flows/login"
 *
 * const client = newFrontendClient()
 *
 * export default async function LoginPage({ searchParams }: PageProps) {
 *   const flow = await useLoginFlow(searchParams, client)
 *
 *   return (
 *     <Login
 *       flow={flow}
 *       config={{
 *         name: "My Project",
 *         sdk: { url: "https://${project.slug}.projects.oryapis.com" },
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @param params The query parameters of the request.
 */
export async function getLoginFlow(
  params: QueryParams,
): Promise<LoginFlow | null | void> {
  return factory(params)
}
