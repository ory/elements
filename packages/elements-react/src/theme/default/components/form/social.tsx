import {
  HeadlessSocialButtonContainerProps,
  HeadlessSocialButtonProps,
} from "@ory/elements-react"
import { useOryFlow } from "@ory/elements-react"
import logos from "../../provider-logos"
import { cn } from "../../utils/cn"

function extractProvider(context: object | undefined): string | undefined {
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

export function DefaultButtonSocial({
  attributes,
  node,
}: HeadlessSocialButtonProps) {
  const {
    flow: { ui },
  } = useOryFlow()

  const oidcNodeCount =
    ui.nodes.filter((node) => node.group === "oidc").length ?? 0

  const Logo = logos[attributes.value]

  const showLabel = oidcNodeCount % 3 !== 0 && oidcNodeCount % 4 !== 0

  const provider = extractProvider(node.meta.label?.context) ?? ""

  return (
    <button
      className={cn(
        "gap-3 border border-forms-border-default bg-button-secondary-bg-default hover:bg-button-secondary-bg-hover transition-colors rounded flex items-center justify-center py-2.5 px-4 md:py-4",
        showLabel && "py-3.5 gap-3",
      )}
      value={attributes.value}
      type="submit"
      name="provider"
    >
      <span className="w-5 h-5">
        {Logo ? (
          <Logo
            width={20}
            height={20}
            // alt={node.meta.label?.text || attributes.value}
            className="object-fill w-full h-full"
          />
        ) : (
          <span className="rounded-full border flex items-center justify-center text-xs">
            {provider.slice(0, 2)}
          </span>
        )}
      </span>
      {showLabel ? (
        <span className="text-sm text-left leading-none font-medium text-forms-fg-default flex-grow">
          {node.meta.label?.text}
        </span>
      ) : null}
    </button>
  )
}

export function DefaultSocialButtonContainer({
  children,
  nodes,
}: HeadlessSocialButtonContainerProps) {
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
