import {
  identifierNameStyle,
  identifierStyle,
} from "../../../theme/identifier.css"
import { SelfServiceFlow } from "../helpers/types"
import { FormattedMessage } from "react-intl"

type IdentifierInfoProps = {
  flow: SelfServiceFlow
}

export const LoggedInfo = ({ flow }: IdentifierInfoProps) => {
  const identifier = flow.ui.nodes.find(
    (i) => "name" in i.attributes && i.attributes.name === "identifier",
  )?.attributes

  if (!identifier || !("value" in identifier)) return null

  return (
    <div className={identifierStyle}>
      <FormattedMessage
        id="login.logged-in-as-label"
        defaultMessage="You're logged in as:"
      />
      <div className={identifierNameStyle}>{identifier.value}</div>
    </div>
  )
}
