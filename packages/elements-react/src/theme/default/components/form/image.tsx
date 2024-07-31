import { useIntl } from "react-intl"
import { HeadlessImageProps } from "../../../../types"

export function DefaultImage({ node, attributes }: HeadlessImageProps) {
  const intl = useIntl()
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
