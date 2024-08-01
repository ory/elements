import { forwardRef } from "react"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"
import { HeadlessLinkButtonProps } from "../../../../types"
import { formatMessage } from "../../../../util"
import { getNodeLabel } from "@ory/client-fetch"

export const DefaultLinkButton = forwardRef<
  HTMLAnchorElement,
  HeadlessLinkButtonProps
>(({ attributes, node }, ref) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  return (
    <a
      {...attributes}
      ref={ref}
      title={formatMessage(label, intl)}
      className={cn(
        "antialiased rounded cursor-pointer text-center border border-transparent gap-3 leading-none bg-button-primary-bg-default hover:bg-button-primary-bg-hover transition-colors text-button-primary-fg-default hover:text-button-primary-fg-hover px-4 py-4.5 text-sm font-medium",
      )}
    >
      {formatMessage(label, intl)}
    </a>
  )
})

DefaultLinkButton.displayName = "DefaultLinkButton"
