// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"
import { FormValues } from "../../types"
import { OryFlowContainer } from "../../util"

/**
 * Input field names that a `login_hint` can pre-fill, in order of preference.
 * `identifier` is used by login flows, `traits.email` by registration flows.
 */
const prefillIdentifierFields = ["identifier", "traits.email"]

/**
 * Extracts and normalizes a `login_hint` value from a URL query string.
 *
 * The hint is purely a UI convenience: it pre-fills the identifier field so the
 * user does not have to retype a known email. It is never used for routing,
 * method selection, or submission.
 *
 * @param search - A URL query string, with or without a leading `?`.
 * @returns The trimmed hint, or `undefined` when it is absent or empty.
 */
export function getLoginHint(search: string): string | undefined {
  const hint = new URLSearchParams(search).get("login_hint")?.trim()
  return hint ? hint : undefined
}

/**
 * Extracts the query string (including the leading `?`) from a URL string.
 *
 * Implemented as a plain index scan instead of `new URL()` so that relative
 * URLs and malformed values cannot throw.
 *
 * @param url - The URL to extract the query string from.
 * @returns The query string, or an empty string when the URL has none.
 */
function searchOf(url: string | undefined): string {
  if (!url) {
    return ""
  }
  const index = url.indexOf("?")
  return index === -1 ? "" : url.slice(index)
}

/**
 * Resolves the `login_hint` to pre-fill the identifier field with
 * (login and registration flows only).
 *
 * The hint is read from the flow's `request_url` — the raw URL of the request
 * that created the flow at Ory, which preserves arbitrary query parameters
 * (e.g. `/self-service/login/browser?login_hint=...`). The page's own URL
 * cannot carry the hint: Ory redirects to the UI with only the flow ID in the
 * query. When the `request_url` has no hint, the OpenID Connect `login_hint`
 * that a relying party sent on an OAuth2 authorization request (carried in
 * `oauth2_login_request.oidc_context`) is used as a fallback.
 *
 * @param flowContainer - The current flow container.
 * @returns The trimmed hint, or `undefined` when no source provides one.
 */
export function resolveLoginHint(
  flowContainer: OryFlowContainer,
): string | undefined {
  if (
    flowContainer.flowType !== FlowType.Login &&
    flowContainer.flowType !== FlowType.Registration
  ) {
    return undefined
  }

  const fromRequestUrl = getLoginHint(searchOf(flowContainer.flow.request_url))
  if (fromRequestUrl) {
    return fromRequestUrl
  }

  const fromOidc =
    flowContainer.flow.oauth2_login_request?.oidc_context?.login_hint?.trim()
  return fromOidc ? fromOidc : undefined
}

export function computeDefaultValues(
  flow: {
    active?: string
    ui: { nodes: UiNode[] }
  },
  loginHint?: string,
): FormValues {
  const defaults = flow.ui.nodes.reduce<FormValues>((acc, node) => {
    const attrs = node.attributes

    if (isUiNodeInputAttributes(attrs)) {
      // TODO: Kratos should return false for the value here, and not undefined.
      if (attrs.type === "checkbox" && typeof attrs.value === "undefined") {
        attrs.value = false
      }
      // Skip the "method" field and "submit" button
      if (attrs.name === "method" || attrs.type === "submit") {
        return acc
      }

      if (attrs.name.startsWith("grant_scope")) {
        const scope = attrs.value as string
        if (Array.isArray(acc.grant_scope)) {
          return {
            ...acc,
            // We want to have all scopes accepted by default, so that the user has to actively uncheck them.
            grant_scope: [...acc.grant_scope, scope],
          }
        } else if (!acc.grant_scope) {
          return {
            ...acc,
            grant_scope: [scope],
          }
        }
        // This shouldn't happen, but just so that we don't throw an error.
        return acc
      }

      // Unroll nested traits or assign default values
      return unrollTrait(
        {
          name: attrs.name,
          value: attrs.value ?? "",
        },
        acc,
      )
    }

    return acc
  }, {})

  if (flow.active) {
    defaults.method = flow.active
  }

  prefillIdentifierFromHint(flow.ui.nodes, defaults, loginHint)

  return defaults
}

/**
 * Pre-fills the identifier field with a `login_hint`, without overwriting a
 * value the user already entered or that Kratos echoed back.
 */
function prefillIdentifierFromHint(
  nodes: UiNode[],
  defaults: FormValues,
  loginHint?: string,
): void {
  const hint = loginHint?.trim()
  if (!hint) {
    return
  }

  for (const name of prefillIdentifierFields) {
    const node = nodes.find(
      (n) =>
        isUiNodeInputAttributes(n.attributes) && n.attributes.name === name,
    )
    if (!node || !isUiNodeInputAttributes(node.attributes)) {
      continue
    }
    const current = node.attributes.value
    if (current === undefined || current === null || current === "") {
      // The value type is pinned to FormValues' value type so `defaults` (a
      // FormValues) is an accepted accumulator; inferring it from `hint` alone
      // would narrow the parameter to a string-only record.
      unrollTrait<string, FormValues[string]>({ name, value: hint }, defaults)
      // Seed only the most-preferred empty field. A field that is present but
      // already has a value falls through to the next preference instead.
      return
    }
  }
}

export function unrollTrait<T extends string, V>(
  input: { name: T; value: V },
  output: Partial<UnrollTrait<T, V>> = {},
): UnrollTrait<T, V> {
  const keys = input.name.split(".")

  // It's challenging to type this for deeply nested structures because the shape
  // of current changes dynamically as we navigate through levels.
  // TODO(jonas): This is not ideal. We should be able to type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = output
  keys.forEach((key, index) => {
    if (!key) return
    current = current[key] =
      index === keys.length - 1 ? input.value : current[key] || {}
  })

  return output as UnrollTrait<T, V>
}

type UnrollTrait<T extends string, V> = T extends `${infer Head}.${infer Tail}`
  ? { [K in Head]: UnrollTrait<Tail, V> }
  : { [K in T]: V }
