// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Snapshots the `ory-elements` Playwright project captures but that no story
 * has ever rendered. They are listed here instead of being picked up
 * automatically, because turning one into a story creates a new Chromatic
 * baseline that somebody has to review.
 *
 * To adopt one, delete its line. To stop capturing it, delete the snapshot and
 * the assertion in `test/e2epw/src/tests/elements` that writes it.
 */
export const NOT_ADOPTED = new Set([
  "login/1fa/identifier_first/captcha/client-error/wrong-captcha.json",
  "login/1fa/identifier_first/refresh/captcha/initial-form.json",
  "login/1fa/identifier_first/refresh/code/initial-form.json",
  "login/1fa/identifier_first/refresh/code/missing-code.json",
  "login/1fa/identifier_first/refresh/code/wrong-code.json",
  "login/1fa/identifier_first/refresh/oidc/refresh.json",
  "login/1fa/identifier_first/refresh/passkey/initial-form.json",
  "login/1fa/identifier_first/refresh/passkey/wrong-passkey.json",
  "login/1fa/identifier_first/refresh/password/initial-form.json",
  "login/1fa/identifier_first/refresh/password/missing-password.json",
  "login/1fa/identifier_first/refresh/password/wrong-password.json",
  "login/1fa/identifier_first/refresh/saml/refresh.json",
  "login/1fa/identifier_first/refresh/webauthn/initial-form.json",
  "login/1fa/identifier_first/refresh/webauthn/wrong-webauthn.json",
  "login/1fa/unified/captcha/client-error/wrong-captcha.json",
  "login/1fa/unified/oidc/initial-form.json",
  "login/1fa/unified/refresh/captcha/initial-form.json",
  "login/1fa/unified/refresh/code/initial-form.json",
  "login/1fa/unified/refresh/code/missing-code.json",
  "login/1fa/unified/refresh/code/wrong-code.json",
  "login/1fa/unified/refresh/passkey/initial-form.json",
  "login/1fa/unified/refresh/passkey/wrong-passkey.json",
  "login/1fa/unified/refresh/password/initial-form.json",
  "login/1fa/unified/refresh/password/missing-password.json",
  "login/1fa/unified/refresh/password/wrong-password.json",
  "login/1fa/unified/refresh/webauthn/initial-form.json",
  "login/1fa/unified/refresh/webauthn/wrong-webauthn.json",
  "login/2fa/all-2fa-methods/initial-form.json",
  "recovery/captcha/client-error/wrong-captcha.json",
  "recovery_v2/captcha/client-error/wrong-captcha.json",
  "registration/one-step/captcha/client-error/wrong-captcha.json",
  "registration/one-step/passkey/initial-form.json",
  "registration/one-step/passkey/passkey-error.json",
  "registration/one-step/webauthn/webauthn-error.json",
  "registration/two-step/captcha/client-error/wrong-captcha.json",
  "registration/two-step/passkey/initial-form.json",
  "registration/two-step/passkey/missing-fields.json",
  "registration/two-step/passkey/passkey-error.json",
  "registration/two-step/passkey/passkey-trigger.json",
  "registration/two-step/webauthn/initial-form.json",
  "registration/two-step/webauthn/missing-fields.json",
  "registration/two-step/webauthn/webauthn-error.json",
  "registration/two-step/webauthn/webauthn-trigger.json",
  "settings/all-2fa-methods/confirmed_lookup_secrets.json",
  "settings/all-2fa-methods/generated_lookup_secrets.json",
  "settings/all-2fa-methods/with-totp-authenticator.json",
  "verification/captcha/client-error/wrong-captcha.json",
])
