import {
  UiNodeInputType,
  SelfServiceFlow,
  SelfServiceFlowGroup
} from '$/next-components/auth/FlowTypes'
import { Grid, GridProps } from '@mui/material'
import KratosNode from '$/components/kratos/Node'
import { uiNodeToId } from '$/pkg/ui'
import { UiNode, UiNodeTypeEnum } from '$/sdks/client'
import { isUiNodeInputAttributes } from '@ory/integrations/ui'

export interface Props {
  flow?: SelfServiceFlow
  spacing?: GridProps['spacing']
  direction?: GridProps['direction']
  groups: Array<SelfServiceFlowGroup>
  inputTypes?: Array<UiNodeInputType>
  includeCSRF?: boolean
}

const FilterFlowNodes = ({
  flow,
  spacing = 3,
  direction,
  groups,
  inputTypes,
  includeCSRF
}: Props) => {
  const getInputType = (node: UiNode): UiNodeInputType =>
    (isUiNodeInputAttributes(node.attributes)
      ? node.attributes.type
      : '') as UiNodeInputType

  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : ''

  const $node = (node: UiNode, k: number) => (
    <KratosNode key={uiNodeToId(node) + k} node={node} />
  )

  const hiddenTypes: Array<UiNodeInputType> = ['hidden', 'script']

  // automatically add the necessary fields for webauthn
  if (groups.includes('webauthn') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input, UiNodeTypeEnum.Script)

  if (groups.includes('totp') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input)

  return flow ? (
    <Grid container spacing={spacing} direction={direction}>
      {flow.ui.nodes
        .filter((node) => groups.includes(node.group))
        .filter(
          (node) => !inputTypes || inputTypes.includes(getInputType(node))
        )
        // get rid of the csrf token here most times and only include when it is required by the form
        .filter((node) => includeCSRF || getInputName(node) !== 'csrf_token')
        .map((node, k) =>
          hiddenTypes.includes(getInputType(node)) ? (
            $node(node, k)
          ) : (
            <Grid item xs={12} md={6} key={k}>
              {$node(node, k)}
            </Grid>
          )
        )}
    </Grid>
  ) : null
}

export default FilterFlowNodes
