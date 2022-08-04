import {
  UiNodeInputType,
  SelfServiceFlow,
  SelfServiceFlowGroup
} from './FlowTypes';

import { UiNode, UiNodeTypeEnum } from '@ory/client';
import { isUiNodeInputAttributes } from '@ory/integrations/ui';
import { Node } from './node';
import { gridStyle } from '../../theme';
import { pxToRem } from '../../utils';

export interface Props {
  flow: SelfServiceFlow;
  groups: Array<SelfServiceFlowGroup>;
  inputTypes?: Array<UiNodeInputType>;
  includeCSRF?: boolean;
}

export const FilterFlowNodes = ({
  flow,
  groups,
  inputTypes,
  includeCSRF
}: Props) => {
  const getInputType = (node: UiNode): UiNodeInputType =>
    (isUiNodeInputAttributes(node.attributes)
      ? node.attributes.type
      : '') as UiNodeInputType;

  const getInputName = (node: UiNode): string =>
    isUiNodeInputAttributes(node.attributes) ? node.attributes.name : '';

  const hiddenTypes: Array<UiNodeInputType> = ['hidden', 'script'];

  // automatically add the necessary fields for webauthn
  if (groups.includes('webauthn') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input, UiNodeTypeEnum.Script);

  if (groups.includes('totp') && inputTypes)
    inputTypes.push(UiNodeTypeEnum.Input);

  return (
    <div className={gridStyle({ gap: 16 })}>
      {flow.ui.nodes.length > 0
        ? flow.ui.nodes
            .filter((node) => groups.includes(node.group))
            .filter(
              (node) => !inputTypes || inputTypes.includes(getInputType(node))
            )
            // get rid of the csrf token here most times and only include when it is required by the form
            .filter(
              (node) => includeCSRF || getInputName(node) !== 'csrf_token'
            )
            .map((node, k) =>
              hiddenTypes.includes(getInputType(node)) ? (
                // TODO: this also adds a gap which it shouldn't
                <Node node={node} key={k} />
              ) : (
                <Node node={node} key={k} />
              )
            )
        : null}
    </div>
  );
};
