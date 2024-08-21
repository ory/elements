import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { Spinner } from "./spinner"
import { cn } from "../../utils/cn"
import { HeadlessButtonProps } from "../../../../types"
import { formatMessage } from "../../../../util"
import { getNodeLabel } from "@ory/client-fetch"

export const DefaultButton = ({
  attributes,
  node,
  onClick,
}: HeadlessButtonProps) => {
  const {
    type,
    name,
    value,
    // Button does not support these attributes, so we skip them
    autocomplete: _ignoredAutocomplete,
    label: _ignoredLabel,
    node_type: _ignoredNodeType,
    // End of skipped attributes
    ...rest
  } = attributes
  const intl = useIntl()
  const label = getNodeLabel(node)
  const {
    formState: { isSubmitting },
    setValue,
  } = useFormContext()

  const isPrimary =
    attributes.name === "method" ||
    attributes.name.includes("passkey") ||
    attributes.name.includes("webauthn")

  return (
    <button
      {...rest}
      value={value}
      name={name}
      type={type === "button" ? "button" : "submit"} // TODO
      onSubmit={() => {
        setValue(name, value)
      }}
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }

        if (type !== "button") {
          setValue(name, value)
        }
      }}
      className={cn(
        // TODO: Difficult to resolve merge conflict here. Please ensure this is correct:
        // "relative antialiased rounded border gap-3 leading-none transition-colors ease-linear duration-100  px-4 py-4.5 text-sm font-medium",
        "antialiased rounded-border-radius-buttons border border-transparent gap-3 bg-button-primary-bg-default hover:bg-button-primary-bg-hover transition-colors text-button-primary-fg-default hover:text-button-primary-fg-hover px-4 py-4.5 text-sm leading-none font-medium",
        {
          "cursor-not-allowed": isSubmitting,
          "bg-button-primary-bg-hover": isSubmitting,
          "bg-button-primary-bg-default hover:bg-button-primary-bg-hover text-button-primary-fg-default hover:text-button-primary-fg-hover":
            isPrimary,
          "bg-button-secondary-bg-default hover:bg-button-secondary-bg-hover text-button-secondary-fg-default hover:text-button-secondary-fg-hover border-button-secondary-border-default":
            !isPrimary,
        },
        {},
      )}
    >
      {isSubmitting ? <Spinner /> : null}
      <span
        className={cn(
          "transition-colors ease-linear duration-100 leading-none text-button-primary-fg-default/20",
          {
            "text-button-primary-fg-default opacity-20 transition-opacity":
              isSubmitting && isPrimary,
            "text-button-secondary-fg-default/20": isSubmitting && !isPrimary,
          },
        )}
      >
        {formatMessage(label, intl)}
      </span>
    </button>
  )
}

DefaultButton.displayName = "DefaultButton"
