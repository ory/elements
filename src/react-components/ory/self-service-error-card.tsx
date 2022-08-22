import React from 'react';
import { SelfServiceError } from '@ory/client';
import { colorSprinkle, gridStyle } from '../../theme';
import { ButtonLink } from '../button-link';
import { Card } from '../card';
import { Message } from '../message';

// SelfServiceErrorCard props
export type SelfServiceErrorCardProps = {
  title: string;
  error: SelfServiceError;
  backURL: string;
  contactSupportEmail?: string;
};

type errorMessage = {
  message: string;
  reason: string;
  status: string;
};

export const SelfServiceErrorCard = ({
  title,
  error,
  backURL,
  contactSupportEmail
}: SelfServiceErrorCardProps): JSX.Element => (
  <Card title={title}>
    <div className={gridStyle({ gap: 32 })}>
      <Message severity="error" data-testid={`ui/message/${error.id}`}>
        An error occurred with the following message:&nbsp;
        {(error.error as errorMessage).message}
      </Message>
      {contactSupportEmail && (
        <Message className={colorSprinkle({ color: 'foregroundMuted' })}>
          If the problem persists, please contact&nbsp;
          <ButtonLink href={`mailto:${contactSupportEmail}`}>
            {contactSupportEmail}
          </ButtonLink>
        </Message>
      )}
      <Message>
        <ButtonLink href={backURL}>Go Back</ButtonLink>
      </Message>
    </div>
  </Card>
);
