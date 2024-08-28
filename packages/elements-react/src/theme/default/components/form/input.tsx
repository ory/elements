import { useFormContext } from "react-hook-form"
import { HeadlessInputProps } from "../../../../types"
import { getNodeLabel } from "@ory/client-fetch"

// Ory Elements v0
//
// return (
//   <InputField
//     helperMessage={
//       <NodeMessages nodes={[node]} gap={4} textPosition={"start"} />
//     }
//     dataTestid={`node/input/${attrs.name}`}
//     className={className}
//     name={attrs.name}
//     header={formatMessage(getNodeLabel(node))}
//     type={attrs.type}
//     autoComplete={
//       attrs.autocomplete ??
//       (attrs.name === "identifier" ? "username" : "")
//     }
//     defaultValue={attrs.value as string | number | string[]}
//     required={attrs.required}
//     disabled={attrs.disabled}
//   />
// )

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
