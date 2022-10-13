import { SelfServiceSettingsFlow } from "@ory/client"
import { gridStyle } from "../../../theme"
import { FilterFlowNodes } from "../helpers/filter-flow-nodes"
import { hasWebauthn } from "../helpers/utils"

export type WebAuthnSettingsProps = {
  flow: SelfServiceSettingsFlow
}

export const WebAuthnSettingsSection = ({
  flow,
}: WebAuthnSettingsProps): JSX.Element | null => {
  const filter = {
    nodes: flow.ui.nodes,
    groups: "webauthn",
    withoutDefaultGroup: true,
  }

  return hasWebauthn(flow.ui.nodes) ? (
    <div className={gridStyle({ gap: 32 })}>
      <FilterFlowNodes
        filter={{ ...filter, excludeAttributes: "submit,button" }}
      />
      <FilterFlowNodes
        filter={{ ...filter, attributes: "submit,button" }}
        buttonOverrideProps={{ fullWidth: false }}
      />
    </div>
  ) : null
}
