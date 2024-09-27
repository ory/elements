import { useFormContext } from "react-hook-form"
import { HeadlessInputProps } from "@ory/elements-react"
import { getNodeLabel } from "@ory/client-fetch"

export const DefaultInput = ({
  node,
  attributes,
  onClick,
}: HeadlessInputProps) => {
  const label = getNodeLabel(node)
  const { register } = useFormContext()
  const { value, autocomplete, name, maxlength, ...rest } = attributes

  return (
    <input
      {...rest}
      onClick={onClick}
      maxLength={maxlength}
      autoComplete={autocomplete}
      placeholder={label?.text ? "Enter your " + label?.text : ""}
      className="antialiased bg-forms-bg-default rounded-border-radius-forms border px-3 py-2.5 md:px-4 md:py-4 border-forms-border-default leading-tight hover:border-forms-border-hover transition-colors text-sm"
      {...register(name, { value })}
    />
  )
}
