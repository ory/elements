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
import { InputField } from '../input-field';

export const Node = ({ node }: { node: UiNode }) => {
  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <></>;
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes as UiNodeInputAttributes;
    switch (node.attributes.type) {
      case 'submit':
        const isSocial =
          (attrs.name === 'provider' || attrs.name === 'link') &&
          node.group === 'oidc';
        return isSocial ? (
          <ButtonSocial
            title={getNodeLabel(node)}
            brand={attrs.value.toLowerCase()}
            variant={'semibold'}
            fullWidth
          />
        ) : (
          <Button
            title={getNodeLabel(node)}
            name={attrs.name}
            type={'submit'}
            variant={'semibold'}
            fullWidth
          />
        );
      case 'button':
        return (
          <Button
            title={getNodeLabel(node)}
            name={attrs.name}
            type={'button'}
            fullWidth
          />
        );
      case 'datetime-local':
      case 'checkbox':
        return <Checkbox label={getNodeLabel(node)} name={attrs.name} />;
      case 'hidden':
      case 'password':
      case 'email':
      case 'text':
        return (
          <InputField title={getNodeLabel(node)} type={attrs.type} fullWidth />
        );
      default:
        return null;
    }
    return null;
  }
  return null;
};
