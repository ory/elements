import { redirectToBrowserEndpoint, onRedirect } from "./utils"
import { RegistrationFlow, FrontendApi, FlowType } from "@ory/client-fetch"
import { QueryParams } from "@/nextjs/types"
import { toFlowParams } from "@/nextjs/app/utils"
import { useRegistrationFlowFactory } from "@/nextjs/registration"
import { getFlowFactory } from "@/nextjs/app/flow"
import { newFrontendClient } from "@/nextjs"

const factory = getFlowFactory({
  redirectToBrowserEndpoint,
  onRedirect,
  toFlowParams,
  flowType: FlowType.Registration,
  fetchFlow: newFrontendClient().getRegistrationFlowRaw,
})

/**
 * Use this method in an app router page to fetch an existing registration flow or to create a new one. This method works with server-side rendering.
 *
 * ```
 * import { useRegistrationFlow, newFrontendClient } from "@ory/nextjs"
 * import { Registration } from "@ory/elements/headless/flows/registration"
 *
 * const client = newFrontendClient()
 *
 * export default async function RegistrationPage({ searchParams }: PageProps) {
 *   const flow = await useRegistrationFlow(searchParams, client)
 *
 *   return (
 *     <Registration
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
export async function getRegistrationFlow(
  params: QueryParams,
): Promise<RegistrationFlow | null | void> {
  return factory(params)
}
