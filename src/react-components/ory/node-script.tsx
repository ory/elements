import { useEffect } from 'react';
import { UiNode, UiNodeScriptAttributes } from '@ory/client';
import { HTMLAttributeReferrerPolicy } from 'react';
import { filterNodesByGroups } from '@ory/integrations/ui';

export const useScriptNode = ({ nodes }: { nodes: UiNode[] }) => {
  useEffect(() => {
    const scriptNodes = filterNodesByGroups({
      nodes: nodes,
      attributes: 'script'
    }).map((node) => node.attributes as UiNodeScriptAttributes);

    const scripts: HTMLScriptElement[] = [];

    for (const script of scriptNodes) {
      const s = document.createElement('script');
      s.async = true;
      s.setAttribute('data-testid', `node/script/${script.id}`);
      s.src = script.src;
      s.async = script.async;
      s.crossOrigin = script.crossorigin;
      s.integrity = script.integrity;
      s.referrerPolicy = script.referrerpolicy as HTMLAttributeReferrerPolicy;
      s.type = script.type;

      scripts.push(s);
      document.body.appendChild(s);
    }
    return () => {
      for (const s of scripts) {
        document.body.removeChild(s);
      }
    };
  }, [nodes]);
};
