import React from 'react';

import { UiNode, UiNodeInputAttributes } from '@ory/client';
import {
  getNodeLabel,
  isUiNodeAnchorAttributes,
  isUiNodeInputAttributes
} from '@ory/integrations/ui';
import { Button } from '../button';
import { ButtonSocial } from '../button-social';
import { Checkbox } from '../checkbox';

export const Node = ({ node }: { node: UiNode }) => {
  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <></>;
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes as UiNodeInputAttributes;
    switch (node.attributes.node_type) {
      case 'hidden':
        return <></>;
      case 'submit':
        const isSocial =
          (attrs.name === 'provider' || attrs.name === 'link') &&
          node.group === 'oidc';
        return isSocial ? (
          <ButtonSocial
            title={getNodeLabel(node)}
            brand={attrs.value.toLowerCase()}
          />
        ) : (
          <Button
            title={getNodeLabel(node)}
            name={attrs.name}
            type={'submit'}
          />
        );
      case 'button':
        return (
          <Button
            title={getNodeLabel(node)}
            name={attrs.name}
            type={'button'}
          />
        );
      case 'checkbox':
        return <Checkbox label={getNodeLabel(node)} name={attrs.name} />;
      default:
        return null;
    }
    return null;
  }
  return null;
};
