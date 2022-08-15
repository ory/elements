import React from 'react';
import { UiNode, UiNodeScriptAttributes } from '@ory/client';
import { HTMLAttributeReferrerPolicy } from 'react';
import { filterNodesByGroups } from '@ory/integrations/ui';

export const ScriptNodes = ({ nodes }: { nodes: UiNode[] }) => {
  const scriptNodes = filterNodesByGroups({
    nodes: nodes,
    withoutDefaultGroup: true,
    groups: ['webauthn'],
    attributes: ['script']
  }).map((node) => node.attributes as UiNodeScriptAttributes);

  console.log({ scriptNodes });

  return (
    <>
      {scriptNodes.map((script) => (
        <script
          key={script.id}
          type={script.type}
          src={script.src}
          integrity={script.integrity}
          referrerPolicy={script.referrerpolicy as HTMLAttributeReferrerPolicy}
          crossOrigin={script.crossorigin}
          data-testid={`node/script/${script.id}`}
          {...(script.async && { async: true })}
        />
      ))}
    </>
  );
};
