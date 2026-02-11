// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineMessages } from "react-intl"

const KNOWN_KRATOS_MESSAGE_IDS = [
  1010001, 1010002, 1010003, 1010004, 1010005, 1010006, 1010007, 1010008,
  1010009, 1010010, 1010011, 1010012, 1010013, 1010014, 1010015, 1010016,
  1010017, 1010018, 1010019, 1010021, 1010022, 1010023, 1040001, 1040002,
  1040003, 1040004, 1040005, 1040006, 1040007, 1040008, 1040009, 1050001,
  1050002, 1050003, 1050004, 1050005, 1050006, 1050007, 1050008, 1050009,
  1050010, 1050011, 1050012, 1050013, 1050014, 1050015, 1050016, 1050017,
  1050018, 1050019, 1050020, 1060001, 1060002, 1060003, 1060004, 1060005,
  1060006, 1060007, 1070001, 1070002, 1070003, 1070004, 1070005, 1070006,
  1070007, 1070008, 1070009, 1070010, 1070011, 1070012, 1070013, 1070014,
  1070015, 1070016, 1070017, 1080001, 1080002, 1080003, 4000001, 4000002,
  4000003, 4000004, 4000005, 4000006, 4000007, 4000008, 4000009, 4000010,
  4000011, 4000012, 4000013, 4000014, 4000015, 4000016, 4000017, 4000018,
  4000019, 4000020, 4000021, 4000022, 4000023, 4000024, 4000025, 4000026,
  4000027, 4000028, 4000029, 4000030, 4000031, 4000032, 4000033, 4000034,
  4000035, 4000036, 4000037, 4000038, 4000039, 4000040, 4000041, 4010001,
  4010002, 4010003, 4010004, 4010005, 4010006, 4010007, 4010008, 4010009,
  4010010, 4040001, 4040002, 4040003, 4050001, 4060001, 4060002, 4060004,
  4060005, 4060006, 4070001, 4070002, 4070003, 4070005, 4070006, 5000001,
  5000002,
] as const

export type KratosMessageId = (typeof KNOWN_KRATOS_MESSAGE_IDS)[number]

export function isKratosMessageId(id: unknown): id is KratosMessageId {
  return (
    typeof id === "number" &&
    KNOWN_KRATOS_MESSAGE_IDS.includes(id as KratosMessageId)
  )
}

export const kratosMessages = defineMessages<number>({
  1010001: {
    id: "identities.messages.1010001",
    defaultMessage: `Sign in`,
  },
  1010002: {
    id: "identities.messages.1010002",
    defaultMessage: `Sign in with {provider}`,
  },
  1010003: {
    id: "identities.messages.1010003",
    defaultMessage: `Please confirm this action by verifying that it is you.`,
  },
  1010004: {
    id: "identities.messages.1010004",
    defaultMessage: `Please complete the second authentication challenge.`,
  },
  1010005: {
    id: "identities.messages.1010005",
    defaultMessage: `Verify`,
  },
  1010006: {
    id: "identities.messages.1010006",
    defaultMessage: `Authentication code`,
  },
  1010007: {
    id: "identities.messages.1010007",
    defaultMessage: `Backup recovery code`,
  },
  1010008: {
    id: "identities.messages.1010008",
    defaultMessage: `Continue with hardware key`,
  },
  1010009: {
    id: "identities.messages.1010009",
    defaultMessage: `Continue`,
  },
  1010010: {
    id: "identities.messages.1010010",
    defaultMessage: `Continue`,
  },
  1010011: {
    id: "identities.messages.1010011",
    defaultMessage: `Sign in with hardware key`,
  },
  1010012: {
    id: "identities.messages.1010012",
    defaultMessage: `Prepare your WebAuthn device (e.g. security key, biometrics scanner, ...) and press continue.`,
  },
  1010013: {
    id: "identities.messages.1010013",
    defaultMessage: `Continue`,
  },
  1010014: {
    id: "identities.messages.1010014",
    defaultMessage: `A code was sent to the address you provided. If you didn't receive it, please check the spelling of the address and try again.`,
  },
  1010015: {
    id: "identities.messages.1010015",
    defaultMessage: `Send sign in code`,
  },
  1010016: {
    id: "identities.messages.1010016",
    defaultMessage: `You tried to sign in with "{duplicateIdentifier}", but that email is already used by another account. Sign in to your account with one of the options below to add your account "{duplicateIdentifier}" at "{provider}" as another way to sign in.`,
  },
  1010017: {
    id: "identities.messages.1010017",
    defaultMessage: `Sign in and link`,
  },
  1010018: {
    id: "identities.messages.1010018",
    defaultMessage: `Confirm with {provider}`,
  },
  1010019: {
    id: "identities.messages.1010019",
    defaultMessage: `Request code to continue`,
  },
  1010021: {
    id: "identities.messages.1010021",
    defaultMessage: `Sign in with passkey`,
  },
  1010022: {
    id: "identities.messages.1010022",
    defaultMessage: `Sign in with password`,
  },
  1010023: {
    id: "identities.messages.1010023",
    defaultMessage: `Send code to {address}`,
  },
  1040001: {
    id: "identities.messages.1040001",
    defaultMessage: `Sign up`,
  },
  1040002: {
    id: "identities.messages.1040002",
    defaultMessage: `Sign up with {provider}`,
  },
  1040003: {
    id: "identities.messages.1040003",
    defaultMessage: `Continue`,
  },
  1040004: {
    id: "identities.messages.1040004",
    defaultMessage: `Sign up with security key`,
  },
  1040005: {
    id: "identities.messages.1040005",
    defaultMessage: `A code has been sent to the address(es) you provided. If you have not received a message, check the spelling of the address and retry the registration.`,
  },
  1040006: {
    id: "identities.messages.1040006",
    defaultMessage: `Send sign up code`,
  },
  1040007: {
    id: "identities.messages.1040007",
    defaultMessage: `Sign up with passkey`,
  },
  1040008: {
    id: "identities.messages.1040008",
    defaultMessage: `Back`,
  },
  1040009: {
    id: "identities.messages.1040009",
    defaultMessage: `Please choose a credential to authenticate yourself with.`,
  },
  1050001: {
    id: "identities.messages.1050001",
    defaultMessage: `Your changes have been saved!`,
  },
  1050002: {
    id: "identities.messages.1050002",
    defaultMessage: `Link {provider}`,
  },
  1050003: {
    id: "identities.messages.1050003",
    defaultMessage: `Unlink {provider}`,
  },
  1050004: {
    id: "identities.messages.1050004",
    defaultMessage: `Unlink TOTP Authenticator App`,
  },
  1050005: {
    id: "identities.messages.1050005",
    defaultMessage: `Authenticator app QR code`,
  },
  1050006: {
    id: "identities.messages.1050006",
    defaultMessage: `{secret}`,
  },
  1050007: {
    id: "identities.messages.1050007",
    defaultMessage: `Reveal backup recovery codes`,
  },
  1050008: {
    id: "identities.messages.1050008",
    defaultMessage: `Enable`,
  },
  1050009: {
    id: "identities.messages.1050009",
    defaultMessage: `{secret}`,
  },
  1050010: {
    id: "identities.messages.1050010",
    defaultMessage: `These are your back up recovery codes. Please keep them in a safe place!`,
  },
  1050011: {
    id: "identities.messages.1050011",
    defaultMessage: `Confirm backup recovery codes`,
  },
  1050012: {
    id: "identities.messages.1050012",
    defaultMessage: `Add security key`,
  },
  1050013: {
    id: "identities.messages.1050013",
    defaultMessage: `Name of the security key`,
  },
  1050014: {
    id: "identities.messages.1050014",
    defaultMessage: `Secret was used at {used_at, date, long}`,
  },
  1050015: {
    id: "identities.messages.1050015",
    defaultMessage: `{secrets_list}`,
  },
  1050016: {
    id: "identities.messages.1050016",
    defaultMessage: `Disable this method`,
  },
  1050017: {
    id: "identities.messages.1050017",
    defaultMessage: `Authenticator Secret`,
  },
  1050018: {
    id: "identities.messages.1050018",
    defaultMessage: `Remove security key "{display_name}"`,
  },
  1050019: {
    id: "identities.messages.1050019",
    defaultMessage: `Add passkey`,
  },
  1050020: {
    id: "identities.messages.1050020",
    defaultMessage: `Remove passkey "{display_name}"`,
  },
  1060001: {
    id: "identities.messages.1060001",
    defaultMessage: `You successfully recovered your account. Please change your password or set up an alternative login method (e.g. social sign in) within the next {privileged_session_expires_at_unix_until_minutes} minutes.`,
  },
  1060002: {
    id: "identities.messages.1060002",
    defaultMessage: `An email containing a recovery link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060003: {
    id: "identities.messages.1060003",
    defaultMessage: `An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060004: {
    id: "identities.messages.1060004",
    defaultMessage: `A recovery code has been sent to {masked_address}. If you have not received it, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060005: {
    id: "identities.messages.1060005",
    defaultMessage: `Recover access to your account by providing your recovery address in full.`,
  },
  1060006: {
    id: "identities.messages.1060006",
    defaultMessage: `How do you want to recover your account?`,
  },
  1060007: {
    id: "identities.messages.1060007",
    defaultMessage: `Back`,
  },
  1070001: {
    id: "identities.messages.1070001",
    defaultMessage: `Password`,
  },
  1070002: {
    id: "identities.messages.1070002",
    defaultMessage: `{title}`,
  },
  1070003: {
    id: "identities.messages.1070003",
    defaultMessage: `Save`,
  },
  1070004: {
    id: "identities.messages.1070004",
    defaultMessage: `ID`,
  },
  1070005: {
    id: "identities.messages.1070005",
    defaultMessage: `Submit`,
  },
  1070006: {
    id: "identities.messages.1070006",
    defaultMessage: `Verify code`,
  },
  1070007: {
    id: "identities.messages.1070007",
    defaultMessage: `Email`,
  },
  1070008: {
    id: "identities.messages.1070008",
    defaultMessage: `Resend code`,
  },
  1070009: {
    id: "identities.messages.1070009",
    defaultMessage: `Continue`,
  },
  1070010: {
    id: "identities.messages.1070010",
    defaultMessage: `Recovery code`,
  },
  1070011: {
    id: "identities.messages.1070011",
    defaultMessage: `Verification code`,
  },
  1070012: {
    id: "identities.messages.1070012",
    defaultMessage: `Registration code`,
  },
  1070013: {
    id: "identities.messages.1070013",
    defaultMessage: `Login code`,
  },
  1070014: {
    id: "identities.messages.1070014",
    defaultMessage: `Login and link credential`,
  },
  1070015: {
    id: "identities.messages.1070015",
    defaultMessage: `Please complete the captcha challenge to continue.`,
  },
  1070016: {
    id: "identities.messages.1070016",
    defaultMessage: `Recovery address`,
  },
  1070017: {
    id: "identities.messages.1070017",
    defaultMessage: `Phone number`,
  },
  1080001: {
    id: "identities.messages.1080001",
    defaultMessage: `An email containing a verification link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1080002: {
    id: "identities.messages.1080002",
    defaultMessage: `You successfully verified your email address.`,
  },
  1080003: {
    id: "identities.messages.1080003",
    defaultMessage: `An email containing a verification code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  4000001: {
    id: "identities.messages.4000001",
    defaultMessage: `{reason}`,
  },
  4000002: {
    id: "identities.messages.4000002",
    defaultMessage: `Please enter the {property} and try again.`,
  },
  4000003: {
    id: "identities.messages.4000003",
    defaultMessage: `length must be >= {min_length}, but got {actual_length}`,
  },
  4000004: {
    id: "identities.messages.4000004",
    defaultMessage: `does not match pattern "{pattern}"`,
  },
  4000005: {
    id: "identities.messages.4000005",
    defaultMessage: `The password can not be used because {reason}.`,
  },
  4000006: {
    id: "identities.messages.4000006",
    defaultMessage: `The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.`,
  },
  4000007: {
    id: "identities.messages.4000007",
    defaultMessage: `An account with the same identifier (email, phone, username, ...) exists already.`,
  },
  4000008: {
    id: "identities.messages.4000008",
    defaultMessage: `The provided authentication code is invalid, please try again.`,
  },
  4000009: {
    id: "identities.messages.4000009",
    defaultMessage: `Could not find any login identifiers. Did you forget to set them? This could also be caused by a server misconfiguration.`,
  },
  4000010: {
    id: "identities.messages.4000010",
    defaultMessage: `Account not active yet. Did you forget to verify your email address?`,
  },
  4000011: {
    id: "identities.messages.4000011",
    defaultMessage: `You have no TOTP device set up.`,
  },
  4000012: {
    id: "identities.messages.4000012",
    defaultMessage: `This backup recovery code has already been used.`,
  },
  4000013: {
    id: "identities.messages.4000013",
    defaultMessage: `You have no WebAuthn device set up.`,
  },
  4000014: {
    id: "identities.messages.4000014",
    defaultMessage: `You have no backup recovery codes set up.`,
  },
  4000015: {
    id: "identities.messages.4000015",
    defaultMessage: `This account does not exist or has no security key set up.`,
  },
  4000016: {
    id: "identities.messages.4000016",
    defaultMessage: `The backup recovery code is not valid.`,
  },
  4000017: {
    id: "identities.messages.4000017",
    defaultMessage: `length must be <= {max_length}, but got {actual_length}`,
  },
  4000018: {
    id: "identities.messages.4000018",
    defaultMessage: `must be >= {minimum} but found {actual}`,
  },
  4000019: {
    id: "identities.messages.4000019",
    defaultMessage: `must be > {minimum} but found {actual}`,
  },
  4000020: {
    id: "identities.messages.4000020",
    defaultMessage: `must be <= {maximum} but found {actual}`,
  },
  4000021: {
    id: "identities.messages.4000021",
    defaultMessage: `must be < {maximum} but found {actual}`,
  },
  4000022: {
    id: "identities.messages.4000022",
    defaultMessage: `{actual} not multipleOf {base}`,
  },
  4000023: {
    id: "identities.messages.4000023",
    defaultMessage: `maximum {max_items} items allowed, but found {actual_items} items`,
  },
  4000024: {
    id: "identities.messages.4000024",
    defaultMessage: `minimum {min_items} items allowed, but found {actual_items} items`,
  },
  4000025: {
    id: "identities.messages.4000025",
    defaultMessage: `items at index {index_a} and {index_b} are equal`,
  },
  4000026: {
    id: "identities.messages.4000026",
    defaultMessage: `expected {allowed_types_list}, but got {actual_type}`,
  },
  4000027: {
    id: "identities.messages.4000027",
    defaultMessage: `An account with the same identifier (email, phone, username, ...) exists already. Please sign in to your existing account to link your social profile.`,
  },
  4000028: {
    id: "identities.messages.4000028",
    defaultMessage: `You tried signing in with {credential_identifier_hint} which is already in use by another account. You can sign in using {available_credential_types_list}. You can sign in using one of the following social sign in providers: {Available_oidc_providers_list}.`,
  },
  4000029: {
    id: "identities.messages.4000029",
    defaultMessage: `must be equal to constant {expected}`,
  },
  4000030: {
    id: "identities.messages.4000030",
    defaultMessage: `const failed`,
  },
  4000031: {
    id: "identities.messages.4000031",
    defaultMessage: `The password can not be used because it is too similar to the identifier.`,
  },
  4000032: {
    id: "identities.messages.4000032",
    defaultMessage: `The password must be at least {min_length} characters long, but got {actual_length}.`,
  },
  4000033: {
    id: "identities.messages.4000033",
    defaultMessage: `The password must be at most {max_length} characters long, but got {actual_length}.`,
  },
  4000034: {
    id: "identities.messages.4000034",
    defaultMessage: `The password has been found in data breaches and must no longer be used.`,
  },
  4000035: {
    id: "identities.messages.4000035",
    defaultMessage: `This account does not exist or has not setup sign in with code.`,
  },
  4000036: {
    id: "identities.messages.4000036",
    defaultMessage: `The provided traits do not match the traits previously associated with this flow.`,
  },
  4000037: {
    id: "identities.messages.4000037",
    defaultMessage: `This account does not exist or has no login method configured.`,
  },
  4000038: {
    id: "identities.messages.4000038",
    defaultMessage: `Captcha verification failed, please try again.`,
  },
  4000039: {
    id: "identities.messages.4000039",
    defaultMessage: `The new password must be different from the old password.`,
  },
  4000040: {
    id: "identities.messages.4000040",
    defaultMessage: `Enter a valid email address`,
  },
  4000041: {
    id: "identities.messages.4000041",
    defaultMessage: `Enter a valid phone number`,
  },
  4010001: {
    id: "identities.messages.4010001",
    defaultMessage: `The login flow expired {expired_at_unix_since_minutes} minutes ago, please try again.`,
  },
  4010002: {
    id: "identities.messages.4010002",
    defaultMessage: `Could not find a strategy to log you in with. Did you fill out the form correctly?`,
  },
  4010003: {
    id: "identities.messages.4010003",
    defaultMessage: `Could not find a strategy to sign you up with. Did you fill out the form correctly?`,
  },
  4010004: {
    id: "identities.messages.4010004",
    defaultMessage: `Could not find a strategy to update your settings. Did you fill out the form correctly?`,
  },
  4010005: {
    id: "identities.messages.4010005",
    defaultMessage: `Could not find a strategy to recover your account with. Did you fill out the form correctly?`,
  },
  4010006: {
    id: "identities.messages.4010006",
    defaultMessage: `Could not find a strategy to verify your account with. Did you fill out the form correctly?`,
  },
  4010007: {
    id: "identities.messages.4010007",
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4010008: {
    id: "identities.messages.4010008",
    defaultMessage: `The login code is invalid or has already been used. Please try again.`,
  },
  4010009: {
    id: "identities.messages.4010009",
    defaultMessage: `Linked credentials do not match.`,
  },
  4010010: {
    id: "identities.messages.4010010",
    defaultMessage: `The address you entered does not match any known addresses in the current account.`,
  },
  4040001: {
    id: "identities.messages.4040001",
    defaultMessage: `The registration flow expired {expired_at_unix_since_minutes} minutes ago, please try again.`,
  },
  4040002: {
    id: "identities.messages.4040002",
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4040003: {
    id: "identities.messages.4040003",
    defaultMessage: `The registration code is invalid or has already been used. Please try again.`,
  },
  4050001: {
    id: "identities.messages.4050001",
    defaultMessage: `The settings flow expired {expired_at_unix_since_minutes} minutes ago, please try again.`,
  },
  4060001: {
    id: "identities.messages.4060001",
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4060002: {
    id: "identities.messages.4060002",
    defaultMessage: `The recovery flow reached a failure state and must be retried.`,
  },
  4060004: {
    id: "identities.messages.4060004",
    defaultMessage: `The recovery token is invalid or has already been used. Please retry the flow.`,
  },
  4060005: {
    id: "identities.messages.4060005",
    defaultMessage: `The recovery flow expired {expired_at_unix_since_minutes} minutes ago, please try again.`,
  },
  4060006: {
    id: "identities.messages.4060006",
    defaultMessage: `The recovery code is invalid or has already been used. Please try again.`,
  },
  4070001: {
    id: "identities.messages.4070001",
    defaultMessage: `The verification token is invalid or has already been used. Please retry the flow.`,
  },
  4070002: {
    id: "identities.messages.4070002",
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4070003: {
    id: "identities.messages.4070003",
    defaultMessage: `The verification flow reached a failure state and must be retried.`,
  },
  4070005: {
    id: "identities.messages.4070005",
    defaultMessage: `The verification flow expired {expired_at_unix_since_minutes} minutes ago, please try again.`,
  },
  4070006: {
    id: "identities.messages.4070006",
    defaultMessage: `The verification code is invalid or has already been used. Please try again.`,
  },
  5000001: {
    id: "identities.messages.5000001",
    defaultMessage: `{reason}`,
  },
  5000002: {
    id: "identities.messages.5000002",
    defaultMessage: `No authentication methods are available. Please contact the system administrator.`,
  },
})
