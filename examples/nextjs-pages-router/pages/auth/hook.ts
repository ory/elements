// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use client"
import { useEffect, useState } from "react"
import {
  Configuration,
  FrontendApi,
  FlowType,
  handleFlowError,
  OnRedirectHandler,
  RegistrationFlow,
} from "@ory/client-fetch"
import { Router, useRouter } from "next/router"
// import { newOryFrontendClient } from "@ory/nextjs"
// import { onValidationError, toValue } from "@ory/nextjs"
import { useSearchParams } from "next/navigation"
// import {QueryParams} from "@ory/nextjs/dist/src/types";
// import {onValidationError} from "@ory/nextjs";
// import { handleRestartFlow, useOnRedirect } from "./utils"

export function getProjectSdkUrl() {
  let baseUrl = ""

  if (process.env["NEXT_PUBLIC_ORY_SDK_URL"]) {
    baseUrl = process.env["NEXT_PUBLIC_ORY_SDK_URL"]
  }

  if (process.env["ORY_SDK_URL"]) {
    baseUrl = process.env["ORY_SDK_URL"]
  }

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable ORY_SDK_URL to your Ory Network SDK URL.",
    )
  }

  return baseUrl.replace(/\/$/, "")
}

export function getSdkUrl() {
  if (process.env["__NEXT_PRIVATE_ORIGIN"]) {
    return process.env["__NEXT_PRIVATE_ORIGIN"].replace(/\/$/, "")
  }

  if (process.env["VERCEL_URL"]) {
    return `https://${process.env["VERCEL_URL"]}`.replace(/\/$/, "")
  }

  return getProjectSdkUrl().replace(/\/$/, "")
}

export function onValidationError<T>(value: T): T {
  return value
}

const toBrowserEndpointRedirect = (
  params: URLSearchParams,
  flowType: FlowType,
) =>
  "http://localhost:3000" +
  "/self-service/" +
  flowType.toString() +
  "/browser?" +
  new URLSearchParams(params).toString()

const handleRestartFlow =
  (searchParams: URLSearchParams, flowType: FlowType) => () => {
    window.location.assign(toBrowserEndpointRedirect(searchParams, flowType))
  }

function newOryFrontendClient() {
  const config = new Configuration({
    headers: {
      Accept: "application/json",
    },
    basePath: "http://localhost:3000",
  })
  return new FrontendApi(config)
}

function useOnRedirect(): OnRedirectHandler {
  const router = useRouter()
  return (url: string, external: boolean) => {
    if (external) {
      window.location.assign(url)
    } else {
      router.push(url)
    }
  }
}
const client = newOryFrontendClient()

export function useRegistrationFlow(): RegistrationFlow | null | void {
  const [flow, setFlow] = useState<RegistrationFlow>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const onRestartFlow = handleRestartFlow(searchParams, FlowType.Registration)
  const onRedirect = useOnRedirect()

  const errorHandler = handleFlowError({
    onValidationError,
    onRestartFlow,
    onRedirect,
  })

  const handleSetFlow = (flow: RegistrationFlow) => {
    setFlow(flow)

    // Use the router to update the `flow` search parameter only
    return router.replace({
      query: { flow: flow.id },
    })
  }

  useEffect(() => {
    const id = searchParams.get("flow")

    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow !== undefined) {
      return
    }

    if (!id) {
      client
        .createBrowserRegistrationFlowRaw({
          returnTo: searchParams.get("return_to") ?? undefined,
          loginChallenge: searchParams.get("login_challenge") ?? undefined,
          afterVerificationReturnTo:
            searchParams.get("after_verification_return_to") ?? undefined,
          organization: searchParams.get("organization") ?? undefined,
        })
        .then((v) => v.value())
        .then((v) => {
          setFlow(v)
          return handleSetFlow(v)
        })
        .catch(errorHandler)
      return
    }

    client
      .getRegistrationFlowRaw({ id })
      .then((r) => r.value())
      .then(setFlow)
      .catch(errorHandler)
  }, [searchParams, router, router.isReady, flow])

  return flow
}

// This gets called on every request
// export async function getRegistrationServerSideProps(
//   context: GetServerSidePropsContext,
// ) {
//   // Otherwise we initialize it
//   const query = toSearchParams(context.query)
//   return await client
//     .createBrowserRegistrationFlowRaw({
//       returnTo: query.get("return_to") ?? undefined,
//       loginChallenge: query.get("login_challenge") ?? undefined,
//       afterVerificationReturnTo:
//         query.get("after_verification_return_to") ?? undefined,
//       organization: query.get("organization") ?? undefined,
//     })
//     .then(toValue)
//     .then((v) => ({
//       props: { flow: replaceUndefinedWithNull(RegistrationFlowToJSON(v)) },
//     }))
//     .catch(
//       handleFlowError({
//         onValidationError,
//         onRestartFlow: () => ({
//           redirect: {
//             destination: toBrowserEndpointRedirect(
//               query,
//               FlowType.Registration,
//             ),
//             permanent: false,
//           },
//         }),
//         onRedirect: (url) => ({
//           redirect: {
//             destination: url,
//             permanent: false,
//           },
//         }),
//       }),
//     )
// }

// function replaceUndefinedWithNull(obj: unknown): unknown {
//   if (Array.isArray(obj)) {
//     return obj.map(replaceUndefinedWithNull)
//   } else if (obj !== null && typeof obj === "object") {
//     Object.keys(obj).forEach((key) => {
//       const value = (obj as Record<string, unknown>)[key]
//       if (value === undefined) {
//         delete (obj as Record<string, unknown>)[key]
//       } else {
//         ;(obj as Record<string, unknown>)[key] = replaceUndefinedWithNull(value)
//       }
//     })
//     return obj
//   }
//   return obj
// }
