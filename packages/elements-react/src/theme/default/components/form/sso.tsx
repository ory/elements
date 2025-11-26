// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import {
  OryFormSsoRootProps,
  OryNodeSsoButtonProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import { ElementType } from "react"
import { useIntl } from "react-intl"
import defaultLogos from "../../provider-logos"
import { cn } from "../../utils/cn"
import { Spinner } from "./spinner"

/**
 * Props for the DefaultButtonSocial component.
 *
 * @inline
 * @hidden
 */
interface DefaultSocialButtonProps extends OryNodeSsoButtonProps {
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
  node,
  logos: providedLogos,
  isSubmitting,
  buttonProps,
  provider,
  attributes,
}: DefaultSocialButtonProps) {
  const logos = { ...defaultLogos, ...providedLogos }
  const intl = useIntl()
  const {
    flow: { ui },
    flowType,
  } = useOryFlow()

  const ssoNodes = ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )

  const ssoNodeCount = ssoNodes.length ?? 0

  const Logo = logos[(attributes.value as string).split("-")[0]]

  const showLabel =
    flowType === FlowType.Settings ||
    (ssoNodeCount % 3 !== 0 && ssoNodeCount % 4 !== 0)

  const label = node.meta.label
    ? uiTextToFormattedMessage(node.meta.label, intl)
    : ""

  return (
    <button
      className="flex cursor-pointer items-center justify-center gap-3 rounded-buttons border border-button-social-border-default bg-button-social-background-default px-4 py-[13px] transition-colors hover:border-button-social-border-hover hover:bg-button-social-background-hover hover:text-button-social-foreground-hover loading:border-button-social-border-disabled loading:bg-button-social-background-disabled loading:text-button-social-foreground-disabled"
      data-testid={`ory/form/node/input/${attributes.name}`}
      data-loading={isSubmitting}
      aria-label={label}
      {...buttonProps}
    >
      <span className="relative size-5">
        {!isSubmitting ? (
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
          <span className="grow text-center leading-none font-medium text-button-social-foreground-default">
            {label}
          </span>
          <span className="block size-5"></span>
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
    <span className="flex size-full items-center justify-center rounded-buttons border-button-social-border-generic-provider bg-button-social-background-generic-provider text-xs text-button-social-foreground-generic-provider">
      {label}
    </span>
  )
}
