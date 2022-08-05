import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow
} from '@ory/client';

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRecoveryFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow;

export type ErrorProps = {
  code: number;
  details: {
    docs: string;
    hint: string;
    rejectReason: string;
  };
  message: string;
  status: string;
  reason: string;
};
