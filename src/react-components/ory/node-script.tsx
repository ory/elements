import React, { HTMLAttributeReferrerPolicy, useEffect } from 'react';
import { NodeScriptProps } from '../../component-types';

export const NodeScript = ({ attributes }: NodeScriptProps) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.async = true;
    script.setAttribute('data-testid', `node/script/${attributes.id}`);
    script.src = attributes.src;
    script.async = attributes.async;
    script.crossOrigin = attributes.crossorigin;
    script.integrity = attributes.integrity;
    script.referrerPolicy =
      attributes.referrerpolicy as HTMLAttributeReferrerPolicy;
    script.type = attributes.type;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [attributes]);

  return null;
};
