import { OryNodeLabelProps } from "@ory/elements-react"

export function MyCustomLabel({
  node,
  children,
  fieldError,
}: OryNodeLabelProps) {
  return (
    <label className="text-blue-600 w-full">
      Custom Label for {node.attributes.name}
      {children}
      {fieldError && (
        <span className="text-red-600">
          Error: {JSON.stringify(fieldError)}
        </span>
      )}
    </label>
  )
}
