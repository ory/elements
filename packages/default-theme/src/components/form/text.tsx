import { UiText } from "@ory/client-fetch"
import { formatMessage, HeadlessTextProps } from "@ory/react-headless"
import { useIntl } from "react-intl"

export function DefaultText({ node, attributes }: HeadlessTextProps) {
  const intl = useIntl()
  return (
    <>
      <p data-testid={`node/text/${attributes.id}/label`}>
        {formatMessage(node.meta.label, intl)}
      </p>
      {(
        attributes.text.context as {
          secrets: UiText[]
        }
      ).secrets?.map((text: UiText, index) => (
        <pre data-testid={`node/text/lookup_secret_codes/text`} key={index}>
          <code>{formatMessage(text, intl)}</code>
        </pre>
      ))}
    </>
  )
}
