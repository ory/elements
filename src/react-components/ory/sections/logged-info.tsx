import {
  identifierNameStyle,
  identifierStyle,
} from "../../../theme/identifier.css"
import { SelfServiceFlow } from "../helpers/types"
import { FormattedMessage } from "react-intl"

export interface IdentifierInfoProps {
  flow: SelfServiceFlow
}

/**
 * LoggedInInfo renders the identifier of the user that is currently logged in.
 * @param flow - Ory Flow object
 */
export const LoggedInInfo = ({ flow }: IdentifierInfoProps) => {
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
