// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormOidcRootProps,
  OryNodeOidcButtonProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import logos from "../../provider-logos"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"

export function extractProvider(
  context: object | undefined,
): string | undefined {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return undefined
}

type DefaultSocialButtonProps = OryNodeOidcButtonProps & {
  showLabel?: boolean
}

export function DefaultButtonSocial({
  attributes,
  node,
  onClick,
  showLabel: _showLabel,
}: DefaultSocialButtonProps) {
  const {
    node_type: _ignoredNodeType,
    type: _ignoredType,
    name: _ignoredName,
    ...props
  } = attributes
  const {
    flow: { ui },
  } = useOryFlow()
  const intl = useIntl()

  const oidcNodeCount =
    ui.nodes.filter((node) => node.group === "oidc").length ?? 0

  const Logo = logos[attributes.value]

  const showLabel =
    _showLabel ?? (oidcNodeCount % 3 !== 0 && oidcNodeCount % 4 !== 0)

  const provider = extractProvider(node.meta.label?.context) ?? ""

  return (
    <button
      className={cn(
        "gap-3 ring-1 ring-forms-border-default bg-button-secondary-bg-default hover:bg-button-secondary-bg-hover transition-colors rounded flex items-center justify-center py-2.5 px-4 md:py-4",
        { "py-2.5": showLabel },
      )}
      value={attributes.value}
      type="submit"
      name="provider"
      {...props}
      onClick={onClick}
    >
      <span className="w-5 h-5">
        {Logo ? (
          <Logo
            size={20}
            // alt={node.meta.label?.text || attributes.value}
            className="object-fill w-full h-full"
          />
        ) : (
          <span className="rounded-full aspect-square border flex items-center justify-center text-xs">
            {provider.slice(0, 2)}
          </span>
        )}
      </span>
      {showLabel && node.meta.label ? (
        <span className="text-sm text-left leading-none font-medium text-forms-fg-default flex-grow">
          {uiTextToFormattedMessage(node.meta.label, intl)}
        </span>
      ) : null}
    </button>
  )
}

export function DefaultSocialButtonContainer({
  children,
  nodes,
}: OryFormOidcRootProps) {
  return (
    <div
      className={cn("grid gap-3", {
        // needed because tailwind is not compiling dynamic classes
        "grid-cols-1": nodes.length % 4 <= 2,
        "grid-cols-3": nodes.length % 3 === 0,
        "grid-cols-4": nodes.length > 1 && nodes.length % 4 === 0,
      })}
    >
      {children}
    </div>
  )
}
