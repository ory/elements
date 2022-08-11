import { SelfServiceError } from '@ory/client';
import { colorSprinkle, gridStyle } from '../../theme';
import { ButtonLink } from '../button-link';
import { Card } from '../card';
import { Message } from '../message';

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
}: SelfServiceErrorCardProps) => (
  <Card title={title}>
    <div className={gridStyle({ gap: 32 })}>
      <Message severity="error" data-testid={`ui/message/${error.id}`}>
        {(error.error as errorMessage).message}
      </Message>
      {contactSupportEmail && (
        <Message className={colorSprinkle({ color: 'foreground-muted' })}>
          If the problem persists, please contact&nbsp;
          <a href={`mailto:${contactSupportEmail}`}>{contactSupportEmail}</a>
        </Message>
      )}
      <Message>
        <ButtonLink href={backURL}>Go Back</ButtonLink>
      </Message>
    </div>
  </Card>
);
