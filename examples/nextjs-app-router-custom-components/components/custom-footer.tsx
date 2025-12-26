// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison -- eslint gets confused because of different versions of @ory/client-fetch */
import { FlowType } from "@ory/client-fetch"
import { ConsentFlow, Node, useOryFlow } from "@ory/elements-react"
import Link from "next/link"
import { findConsentNodes } from "./consent-utils"

export function MyCustomFooter() {
  const flow = useOryFlow()

  switch (flow.flowType) {
    case FlowType.Login:
      return (
        <>
          Don't have an account?{" "}
          <Link href="/auth/registration">Register here</Link>
        </>
      )
    case FlowType.Registration:
      return (
        <>
          Already have an account? <Link href="/auth/login">Login here</Link>
        </>
      )
    case FlowType.Recovery:
      return (
        <>
          Remembered your password? <Link href="/auth/login">Login here</Link>
        </>
      )
    case FlowType.Verification:
      return null
    case FlowType.OAuth2Consent:
      return <ConsentFooter flow={flow.flow} />
    default:
      return null
  }
}

function ConsentFooter({ flow }: { flow: ConsentFlow }) {
  const { rememberNode, submitNodes } = findConsentNodes(flow.ui.nodes)
  const clientName = flow.consent_request.client?.client_name ?? "this application"

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-medium text-gray-700">
          Make sure you trust {clientName}
        </p>
        <p className="text-sm text-gray-500">
          You may be sharing sensitive information with this site or application.
        </p>
      </div>

      {rememberNode && <Node.Checkbox node={rememberNode} />}

      <div className="grid grid-cols-2 gap-2">
        {submitNodes.map((node) => (
          <Node.Button key={String(node.attributes.value)} node={node} />
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Authorizing will redirect to {clientName}
      </p>
    </div>
  )
}
