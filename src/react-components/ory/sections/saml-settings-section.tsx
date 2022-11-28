import { SelfServiceSettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasSaml } from "../helpers/utils"

export type SAMLSettingsProps = {
  flow: SelfServiceSettingsFlow
  title?: string
}

export const SAMLSettingsSection = ({
  flow,
}: SAMLSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "saml",
    withoutDefaultGroup: true,
  }

  return hasSaml(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={filter}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
