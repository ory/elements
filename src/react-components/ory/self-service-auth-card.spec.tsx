import React from 'react';
import { expect, test } from '@playwright/experimental-ct-react';
import { SelfServiceAuthCard } from './self-service-auth-card';

test('ory auth card', async ({ mount }) => {
  const component = await mount(
    <SelfServiceAuthCard
      title={'Sign in'}
      flowType={'login'}
      additionalProps={{
        forgotPasswordURL: '/forgot',
        signupURL: '/signup'
      }}
      flow={{
        id: '',
        state: 'choose_method',
        type: 'browser',
        ui: {
          action: '',
          method: 'POST',
          nodes: [
            {
              group: 'default',
              attributes: {
                name: 'id',
                type: 'text',
                node_type: 'input',
                disabled: false
              },
              messages: [],
              type: 'input',
              meta: {}
            }
          ]
        }
      }}
    />
  );
  await expect(component).toContainText('Sign in');
  await expect(component.locator('href=/forgot')).toBe(true);
  await expect(component.locator('href=/signup')).toBe(true);
});
