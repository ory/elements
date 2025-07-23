// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSsoRootProps,
  OryNodeSsoButtonProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import { ElementType, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useDebounceValue } from "usehooks-ts"
import defaultLogos from "../../provider-logos"
import { cn } from "../../utils/cn"
import { Spinner } from "./spinner"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { omitInputAttributes } from "../../../../util/omitAttributes"

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

/**
 * Props for the DefaultButtonSocial component.
 *
 * @inline
 * @hidden
 */
interface DefaultSocialButtonProps extends OryNodeSsoButtonProps {
  /**
   * Whether to show the label next to the logo.
   * If not provided, it will be determined based on the number of SSO nodes.
   */
  showLabel?: boolean
  /**
   * Logos to use for the social buttons.
   * If not provided, the default logos will be used.
   */
  logos?: Record<string, ElementType>
}

/**
 * The default implementation of a social button for Ory SSO.
 * It renders a button with a logo and an optional label.
 *
 * @param props - The props for the DefaultButtonSocial component.
 * @returns
 * @category Default Components
 * @group Components
 * @inlineType OryNodeSsoButtonProps
 */
export function DefaultButtonSocial({
  attributes,
  node,
  onClick,
  showLabel: _showLabel,
  logos: providedLogos,
}: DefaultSocialButtonProps) {
  const logos = { ...defaultLogos, ...providedLogos }
  const { type: _ignoredType, name: _ignoredName, ...rest } = attributes
  const {
    flow: { ui },
  } = useOryFlow()
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)
  const intl = useIntl()
  const {
    formState: { isSubmitting },
  } = useFormContext()

  const ssoNodeCount =
    ui.nodes.filter(
      (node) =>
        node.group === UiNodeGroupEnum.Oidc ||
        node.group === UiNodeGroupEnum.Saml,
    ).length ?? 0

  // Ideally, kratos would return the provider name in the context
  // At the moment it only returns the label (misleadingly named `provider`).
  // But changing that would be a breaking change.
  // So we have to extract the provider name from the id, which sometimes might contain a - followed by a unique ID.
  // TODO(kratos): Add provider to the context
  const Logo = logos[(attributes.value as string).split("-")[0]]

  const showLabel =
    _showLabel ?? (ssoNodeCount % 3 !== 0 && ssoNodeCount % 4 !== 0)

  const provider = extractProvider(node.meta.label?.context) ?? ""

  const localOnClick = () => {
    onClick?.()
    setClicked(true)
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  const label = node.meta.label
    ? uiTextToFormattedMessage(node.meta.label, intl)
    : ""

  return (
    <button
      className="gap-3 border border-button-social-border-default bg-button-social-background-default hover:bg-button-social-background-hover hover:border-button-social-border-hover transition-colors rounded-buttons flex items-center justify-center px-4 py-[13px] loading:bg-button-social-background-disabled loading:border-button-social-border-disabled loading:text-button-social-foreground-disabled hover:text-button-social-foreground-hover"
      value={attributes.value}
      type="submit"
      name="provider"
      data-testid={`ory/form/node/input/${attributes.name}`}
      onClick={localOnClick}
      data-loading={clicked}
      disabled={isSubmitting}
      aria-label={label}
      {...omitInputAttributes(rest)}
    >
      <span className="size-5 relative">
        {!clicked ? (
          Logo ? (
            <Logo size={20} />
          ) : (
            <GenericLogo label={provider.slice(0, 1)} />
          )
        ) : (
          <Spinner className="size-5" />
        )}
      </span>
      {showLabel && node.meta.label ? (
        <>
          <span className="grow text-center font-medium leading-none text-button-social-foreground-default">
            {label}
          </span>
          <span className="size-5 block"></span>
        </>
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
}: OryFormSsoRootProps) {
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

export function GenericLogo({ label }: { label: string }) {
  return (
    <span className="flex rounded-buttons bg-button-social-background-generic-provider text-button-social-foreground-generic-provider border-button-social-border-generic-provider text-xs size-full items-center justify-center">
      {label}
    </span>
  )
}
