import {
  UiNodeInputType,
  SelfServiceFlow,
  SelfServiceFlowGroup
} from './FlowTypes'

import { UiNode, UiNodeTypeEnum } from '@ory/client'
import { isUiNodeInputAttributes } from '@ory/integrations/ui'
import { Node } from './node'

export interface Props {
  flow: SelfServiceFlow
  groups: Array<SelfServiceFlowGroup>
  inputTypes?: Array<UiNodeInputType>
  includeCSRF?: boolean
}

const FilterFlowNodes = ({
  flow,
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
    <Node node={node} />
  )

  const hiddenTypes: Array<UiNodeInputType> = ['hidden', 'script']

  // automatically add the necessary fields for webauthn
  if (groups.includes('webauthn') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input, UiNodeTypeEnum.Script)

  if (groups.includes('totp') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input)

  return (
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
            <>
            {$node(node, k)}
            </>
          )
        )}
  )
}

export default FilterFlowNodes
