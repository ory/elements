// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormOidcRootProps,
  OryNodeOidcButtonProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import defaultLogos from "../../provider-logos"
import { cn } from "../../utils/cn"
import { useIntl } from "react-intl"
import { ElementType, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Spinner } from "./spinner"

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
  logos?: Record<string, ElementType>
}

export function DefaultButtonSocial({
  attributes,
  node,
  onClick,
  showLabel: _showLabel,
  logos: providedLogos,
}: DefaultSocialButtonProps) {
  const logos = { ...defaultLogos, ...providedLogos }
  const {
    node_type: _ignoredNodeType,
    type: _ignoredType,
    name: _ignoredName,
    ...props
  } = attributes
  const {
    flow: { ui },
  } = useOryFlow()
  const [clicked, setClicked] = useState(false)
  const intl = useIntl()
  const {
    formState: { isSubmitting },
  } = useFormContext()

  const oidcNodeCount =
    ui.nodes.filter((node) => node.group === "oidc").length ?? 0

  // Ideally, kratos would return the provider name in the context
  // At the moment it only returns the label (misleadingly named `provider`).
  // But changing that would be a breaking change.
  // So we have to extract the provider name from the id, which sometimes might contain a - followed by a unique ID.
  // TODO(kratos): Add provider to the context
  const Logo = logos[(attributes.value as string).split("-")[0]]

  const showLabel =
    _showLabel ?? (oidcNodeCount % 3 !== 0 && oidcNodeCount % 4 !== 0)

  const provider = extractProvider(node.meta.label?.context) ?? ""

  const localOnClick = () => {
    setClicked(true)
    onClick?.()
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting])

  return (
    <button
      className="gap-3 border border-button-social-border-default bg-button-social-background-default hover:bg-button-social-background-hover transition-colors rounded flex items-center justify-center px-4 py-[13px] loading:bg-button-social-background-disabled loading:border-button-social-border-disabled loading:text-button-social-foreground-disabled hover:text-button-social-foreground-hover"
      value={attributes.value}
      type="submit"
      name="provider"
      data-testid={`ory/form/node/input/${attributes.name}`}
      {...props}
      onClick={localOnClick}
      data-loading={clicked}
      disabled={isSubmitting}
    >
      <span className="size-5 relative">
        {!clicked ? (
          Logo ? (
            <Logo size={20} />
          ) : (
            <span className="flex aspect-square items-center justify-center rounded-[999px] border text-xs">
              {provider.slice(0, 2)}
            </span>
          )
        ) : (
          <Spinner className="size-5" />
        )}
      </span>
      {showLabel && node.meta.label ? (
        <span className="grow text-left font-medium leading-none text-button-social-foreground-default">
          {uiTextToFormattedMessage(node.meta.label, intl)}
        </span>
      ) : null}
    </button>
  )
}

/**
 * Returns a variant of DefaultButtonSocial that can use your own logos
 *
 * @param logos - a record of provider names and their respective logos
 * @returns a variant of DefaultButtonSocial that uses the provided logos
 */
DefaultButtonSocial.WithLogos =
  (logos: Record<string, ElementType>) => (props: DefaultSocialButtonProps) => (
    <DefaultButtonSocial {...props} logos={logos} />
  )

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
