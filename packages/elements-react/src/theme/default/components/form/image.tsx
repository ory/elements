import { HeadlessImageProps } from "../../../../types"

export function DefaultImage({ attributes }: HeadlessImageProps) {
  // const intl = useIntl()
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
