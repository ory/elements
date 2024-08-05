import { formatMessage } from "../index"
import { UiText } from "@ory/client-fetch"
import { useIntl } from "react-intl"

export const Inner = ({ uiText }: { uiText: UiText }) => {
  const intl = useIntl()

  return <div>{formatMessage(uiText, intl)}</div>
}
