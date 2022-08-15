import React, { MouseEvent } from 'react';

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

interface ButtonSubmit {
  type: 'submit' | 'reset' | 'button' | undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  formNoValidate?: boolean;
}

export const Node = ({ node }: { node: UiNode }) => {
  if (isUiNodeAnchorAttributes(node.attributes)) {
    return <></>;
  } else if (isUiNodeInputAttributes(node.attributes)) {
    const attrs = node.attributes as UiNodeInputAttributes;
    const isSocial =
      (attrs.name === 'provider' || attrs.name === 'link') &&
      node.group === 'oidc';

    // TODO: update ory client package to support enum for button type
    const submit: ButtonSubmit = {
      type: attrs.type as any
    };

    switch (node.attributes.type) {
      case 'submit':
        if (isSocial) {
          submit.formNoValidate = true;
          submit.onClick = (e) => {
            e.currentTarget.type = 'submit';
            e.currentTarget.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          };
        }

        if (attrs.onclick) {
          // This is a bit hacky but it wouldn't work otherwise.
          const oc = attrs.onclick;
          submit.onClick = () => {
            eval(oc);
          };
        }

        return isSocial ? (
          <ButtonSocial
            title={getNodeLabel(node)}
            brand={attrs.value.toLowerCase()}
            variant={'semibold'}
            size={'large'}
            name={attrs.name}
            value={attrs.value}
            fullWidth
            {...submit}
          />
        ) : (
          <Button
            title={getNodeLabel(node)}
            name={attrs.name}
            variant={'semibold'}
            fullWidth
            value={attrs.value}
            {...submit}
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
          <InputField
            name={attrs.name}
            title={getNodeLabel(node)}
            type={attrs.type}
            autoComplete={
              attrs.autocomplete || attrs.name === 'identifier'
                ? 'username'
                : ''
            }
            required={attrs.required}
            fullWidth
          />
        );
      default:
        return null;
    }
  }
  return null;
};
