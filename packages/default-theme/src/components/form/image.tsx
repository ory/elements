import { HeadlessImageProps } from "@ory/react-headless"
import { useIntl } from "react-intl"

export function DefaultImage({ node, attributes }: HeadlessImageProps) {
  const intl = useIntl()
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
