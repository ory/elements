// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client-fetch"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useRef, useState } from "react"
import { clientSideFrontendClient } from "./client"

// Currently duplicated from the theme export, because we have no "shared code" package.
// In the future, we should consider moving this to a shared package.
export type OryError =
  | {
      error: string
      error_description: string
    }
  | FlowError

/**
 * Use this hook in a page to fetch an error from the Ory SDK. This hook works with client-side rendering.
 *
 * @example
 * ```tsx
 * import { Error as ErrorComponent } from "@ory/elements-react/theme"
 * import "@ory/elements-react/theme/styles.css"
 * import { useRouter } from "next/router"
 *
 * import config from "@/ory.config"
 * import { useError } from "@ory/nextjs/pages"
 *
 * export default function ErrorPage() {
 *   const router = useRouter()
 *
 *   const error = useError(router.query)
 *
 *   if (!error) {
 *     return null
 *   }
 *
 *   return (
 *     <main className="p-4 pb-8 flex items-center justify-center flex-col gap-8 min-h-screen">
 *       <ErrorComponent error={error} config={config} components={{ Card: {} }} />
 *     </main>
 *   )
 * }
 * ```
 *
 * @param params - the `router.query` object from Next.js
 * @returns An object containing the error and error description, or a FlowError object if the error is a flow error. If the error is not a flow error, the error description will be "An unknown error occurred.".
 * @public
 */
export function useError(params: ParsedUrlQuery) {
  const lastFetchedError = useRef("")
  const [error, setError] = useState<OryError | null>(null)

  useEffect(() => {
    const errorParam = params["error"]
    if (typeof errorParam === "string") {
      const description = params["error_description"]
      setError({
        error: errorParam,
        error_description:
          (typeof description === "string" ? description : undefined) ??
          "An unknown error occurred.",
      })
      return
    }

    const id = params["id"]?.toString() ?? ""
    if (!!id && id === lastFetchedError.current) {
      return
    }

    if (!id) {
      setError({
        error: "unknown_error",
        error_description: "An unknown error occurred.",
      })
      return
    }
    lastFetchedError.current = id
    clientSideFrontendClient()
      .getFlowError({ id })
      .then(setError)
      .catch((err: unknown) => {
        setError({
          error: "unknown_error",
          error_description:
            err instanceof Error ? err.message : "An unknown error occurred.",
        })
      })
  }, [params])

  return error
}
