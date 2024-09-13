import { HeadlessImageProps } from "@ory/elements-react"

export function DefaultImage({ attributes }: HeadlessImageProps) {
  // const intl = useIntl()
  return (
    <figure>
      <img {...attributes} />
    </figure>
  )
}
