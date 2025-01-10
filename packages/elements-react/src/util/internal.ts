// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function replaceWindowFlowId(flow: string) {
  const url = new URL(window.location.href)
  url.searchParams.set("flow", flow)
  window.location.href = url.toString()
}
