// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"

import { UiNodeScriptAttributes } from "@ory/client-fetch"
import { useEffect } from "react"

type NodeScriptProps = {
  attributes: UiNodeScriptAttributes
}

export function NodeScript({ attributes }: NodeScriptProps) {
  useEffect(() => {
    const {
      crossorigin,
      referrerpolicy,
      node_type: _nodeType,
      ...rest
    } = attributes
    const script = document.createElement("script")
    Object.assign(script, rest, {
      crossOrigin: crossorigin,
      referrerPolicy: referrerpolicy,
      nonce:
        document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce ||
        attributes.nonce,
    })

    if (
      Array.from(document.scripts).some(
        (existing) =>
          existing.src === script.src &&
          existing.type === script.type &&
          existing.integrity === script.integrity &&
          existing.crossOrigin === script.crossOrigin &&
          existing.referrerPolicy === script.referrerPolicy,
      )
    ) {
      return
    }

    script.addEventListener("error", () => script.remove(), { once: true })
    document.head.append(script)
  }, [attributes])

  return null
}
