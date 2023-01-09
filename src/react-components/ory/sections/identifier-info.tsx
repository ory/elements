import {
  identifierNameStyle,
  identifierStyle,
} from "../../../theme/identifier.css"
import { SelfServiceFlow } from "../helpers/types"

type IdentifierInfoProps = {
  flow: SelfServiceFlow
}

export const IdentifierInfo = ({ flow }: IdentifierInfoProps) => {
  const identifier = flow.ui.nodes.find(
    (i) => "name" in i.attributes && i.attributes.name === "identifier",
  )?.attributes

  if (!identifier || !("value" in identifier)) return null

  return (
    <div className={identifierStyle}>
      You're logged in as:
      <div className={identifierNameStyle}>{identifier.value}</div>
    </div>
  )
}
