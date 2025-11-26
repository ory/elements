import { OryNodeImageProps } from "@ory/elements-react"

export function MyCustomImage({ node }: OryNodeImageProps) {
  return (
    <figure className="border border-red-600">
      <img {...node.attributes} alt={node.meta.label?.text || ""} />
    </figure>
  )
}
