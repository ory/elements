## API Report File for "@ory/elements-react"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ComponentPropsWithoutRef } from 'react';
import { ComponentType } from 'react';
import { ConfigurationParameters } from '@ory/client-fetch';
import { DetailedHTMLProps } from 'react';
import { FlowError } from '@ory/client-fetch';
import { FormEventHandler } from 'react';
import { HTMLAttributes } from 'react';
import { LoginFlow } from '@ory/client-fetch';
import { MouseEventHandler } from 'react';
import { PropsWithChildren } from 'react';
import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { RecoveryFlow } from '@ory/client-fetch';
import { RegistrationFlow } from '@ory/client-fetch';
import { SettingsFlow } from '@ory/client-fetch';
import { UiNode } from '@ory/client-fetch';
import { UiNodeAnchorAttributes } from '@ory/client-fetch';
import { UiNodeImageAttributes } from '@ory/client-fetch';
import { UiNodeInputAttributes } from '@ory/client-fetch';
import { UiNodeTextAttributes } from '@ory/client-fetch';
import { UiText } from '@ory/client-fetch';
import { VerificationFlow } from '@ory/client-fetch';

// Warning: (ae-forgotten-export) The symbol "OryCardProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function DefaultCard({ children }: OryCardProps): react_jsx_runtime.JSX.Element;

// Warning: (ae-forgotten-export) The symbol "OryCardContentProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function DefaultCardContent({ children }: OryCardContentProps): react.ReactNode;

// @public (undocumented)
export function DefaultCardFooter(): react_jsx_runtime.JSX.Element | null;

// @public (undocumented)
export function DefaultCardHeader(): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export function DefaultCardLogo(): react_jsx_runtime.JSX.Element;

// Warning: (ae-forgotten-export) The symbol "HeadlessFormProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function DefaultFormContainer({ children, onSubmit, action, method, }: PropsWithChildren<HeadlessFormProps>): react_jsx_runtime.JSX.Element;

// Warning: (ae-forgotten-export) The symbol "HeadlessMessageProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function DefaultMessage({ message }: HeadlessMessageProps): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export function DefaultMessageContainer({ children }: PropsWithChildren): react_jsx_runtime.JSX.Element | null;

// @public (undocumented)
function Error_2({ error, children, }: PropsWithChildren<ErrorFlowContextProps>): react_jsx_runtime.JSX.Element;
export { Error_2 as Error }

// @public (undocumented)
export type ErrorFlowContextProps = {
    error: FlowError;
    components?: Partial<OryFlowComponents>;
    config: OryClientConfiguration;
};

// @public (undocumented)
export function Login({ flow, config, children, components: flowOverrideComponents, }: PropsWithChildren<LoginFlowContextProps>): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export type LoginFlowContextProps = {
    flow: LoginFlow;
    components?: Partial<OryFlowComponents>;
    config: OryClientConfiguration;
};

// @public (undocumented)
export const OryDefaultComponents: OryFlowComponents;

// @public (undocumented)
export function Recovery({ flow, config, children, components: flowOverrideComponents, }: PropsWithChildren<RecoveryFlowContextProps>): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export type RecoveryFlowContextProps = {
    flow: RecoveryFlow;
    components?: Partial<OryFlowComponents>;
    config: OryClientConfiguration;
};

// Warning: (ae-forgotten-export) The symbol "RegistrationFlowContextProps" needs to be exported by the entry point index.d.ts
//
// @public (undocumented)
export function Registration({ flow, children, components: flowOverrideComponents, config, }: PropsWithChildren<RegistrationFlowContextProps>): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export function Settings({ flow, config, children, components: flowOverrideComponents, }: PropsWithChildren<SettingsFlowContextProps>): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export type SettingsFlowContextProps = {
    flow: SettingsFlow;
    components?: Partial<OryFlowComponents>;
    config: OryClientConfiguration;
};

// @public (undocumented)
export function Verification({ flow, config, children, components: flowOverrideComponents, }: PropsWithChildren<VerificationFlowContextProps>): react_jsx_runtime.JSX.Element;

// @public (undocumented)
export type VerificationFlowContextProps = {
    flow: VerificationFlow;
    components?: Partial<OryFlowComponents>;
    config: OryClientConfiguration;
};

// Warnings were encountered during analysis:
//
// dist/theme/default/index.d.ts:25:5 - (ae-forgotten-export) The symbol "OryFlowComponents" needs to be exported by the entry point index.d.ts
// dist/theme/default/index.d.ts:26:5 - (ae-forgotten-export) The symbol "OryClientConfiguration" needs to be exported by the entry point index.d.ts

// (No @packageDocumentation comment for this package)

```