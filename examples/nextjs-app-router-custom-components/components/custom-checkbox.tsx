import { getNodeLabel } from "@ory/client-fetch"
import { OryNodeCheckboxProps } from "@ory/elements-react"

export function MyCustomCheckbox({ node, inputProps }: OryNodeCheckboxProps) {
  const nodeLabel = getNodeLabel(node)

  return (
    <label>
      {nodeLabel?.text}&nbsp;
      <input {...inputProps} className="bg-red-300" />
    </label>
  )
}
