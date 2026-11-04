## 1.0.0

### Major Changes

- First stable release. Changes since 1.0.0-rc.1:
  
  - **Breaking:** `createOryMiddleware` requires `trustedOrigins`, the exact origins or RegExp patterns the deployment serves, and throws at startup when it is unset or empty. The request origin is sent to Ory as the base URL for redirects and emails only when it matches the list.
  - **Breaking:** Requires `react` 18.2 or later.
  - Built on `@ory/ssr`, which fetches flows and sessions from a standard `Request`. The proxy uses web-standard APIs instead of `Buffer`.
  - The middleware forwards the browser's `Origin` and `Sec-Fetch-*` headers to Ory.
  - Settings flows restart when the session is missing or expired, sending users through sign-in and keeping `return_to`.
  - Preview deployments on a custom domain that is same-site with the Ory URL talk to Ory directly instead of through the proxy.
  - Ships version-matched agent guides in `agents/`.

## 1.0.0-rc.0 (2025-05-15)

### 🚀 Features

- method translation for totp, code, webauthn ([#500](https://github.com/ory/elements/pull/500))
- add all missing stories ([#480](https://github.com/ory/elements/pull/480))
- preview deployments for example apps ([#488](https://github.com/ory/elements/pull/488))
- add support for Ory Hydra consent screens ([#373](https://github.com/ory/elements/pull/373))
- support SAML-native ([#395](https://github.com/ory/elements/pull/395))
- add SAML group handling ([#390](https://github.com/ory/elements/pull/390))
- add more intelligent error screen ([#383](https://github.com/ory/elements/pull/383))
- support captchas natively in new and old elements ([#372](https://github.com/ory/elements/pull/372))
- expose get flow factory ([#333](https://github.com/ory/elements/pull/333))

### 🩹 Fixes

- captcha reloading and duplication ([#518](https://github.com/ory/elements/pull/518))
- ⚠️  rework configuration management ([#515](https://github.com/ory/elements/pull/515))
- ⚠️  align configuration types to Ory Network APIs ([#423](https://github.com/ory/elements/pull/423))
- correctly guess vercel environment ([#484](https://github.com/ory/elements/pull/484))
- await headers ([#466](https://github.com/ory/elements/pull/466))
- missing hidden field regression ([#439](https://github.com/ory/elements/pull/439))
- add missing captcha group to all methods ([#432](https://github.com/ory/elements/pull/432))
- resolve wcag2aa color contrast issues ([#367](https://github.com/ory/elements/pull/367))
- center text on OIDC buttons and debounce state update ([#366](https://github.com/ory/elements/pull/366))
- invisible LinkedIn icon ([#355](https://github.com/ory/elements/pull/355))
- define a fallback font stack ([#349](https://github.com/ory/elements/pull/349))

### ⚠️  Breaking Changes

- ⚠️  rework configuration management ([#515](https://github.com/ory/elements/pull/515))
- ⚠️  align configuration types to Ory Network APIs ([#423](https://github.com/ory/elements/pull/423))

### ❤️ Thank You

- hackerman @aeneasr
- Jonas Hungershausen

## 1.0.0-next.5 (2025-03-25)

### 🚀 Features

- add SAML group handling ([#390](https://github.com/ory/elements/pull/390))
- add more intelligent error screen ([#383](https://github.com/ory/elements/pull/383))
- support captchas natively in new and old elements ([#372](https://github.com/ory/elements/pull/372))
- expose get flow factory ([#333](https://github.com/ory/elements/pull/333))

### 🩹 Fixes

- center text on OIDC buttons and debounce state update ([#366](https://github.com/ory/elements/pull/366))
- translate {property} in missing property validation message ([#357](https://github.com/ory/elements/pull/357))
- invisible LinkedIn icon ([#355](https://github.com/ory/elements/pull/355))
- define a fallback font stack ([#349](https://github.com/ory/elements/pull/349))
- brand logic in social sign in icon ([#348](https://github.com/ory/elements/pull/348))

### ❤️  Thank You

- hackerman @aeneasr
- Henning Perl @hperl
- Jonas Hungershausen

## 1.0.0-next.4 (2025-03-25)

### 🚀 Features

- add SAML group handling ([#390](https://github.com/ory/elements/pull/390))
- add more intelligent error screen ([#383](https://github.com/ory/elements/pull/383))
- support captchas natively in new and old elements ([#372](https://github.com/ory/elements/pull/372))
- expose get flow factory ([#333](https://github.com/ory/elements/pull/333))

### 🩹 Fixes

- center text on OIDC buttons and debounce state update ([#366](https://github.com/ory/elements/pull/366))
- translate {property} in missing property validation message ([#357](https://github.com/ory/elements/pull/357))
- invisible LinkedIn icon ([#355](https://github.com/ory/elements/pull/355))
- define a fallback font stack ([#349](https://github.com/ory/elements/pull/349))
- brand logic in social sign in icon ([#348](https://github.com/ory/elements/pull/348))

### ❤️  Thank You

- hackerman @aeneasr
- Henning Perl @hperl
- Jonas Hungershausen

## 1.0.0-next.3 (2025-01-21)

### 🚀 Features

- expose get flow factory ([#333](https://github.com/ory/elements/pull/333))

### ❤️  Thank You

- hackerman @aeneasr

## 1.0.0-next.21 (2025-01-18)

This was a version bump only for @ory/nextjs to align it with other projects, there were no code changes.

## 1.0.0-next.20 (2025-01-16)

### 🚀 Features

- handle state transition edge cases ([f2e4023](https://github.com/ory/elements/commit/f2e4023))
- add page and app router examples ([#307](https://github.com/ory/elements/pull/307))
- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))
- add @ory/nextjs package ([#303](https://github.com/ory/elements/pull/303))

### 🩹 Fixes

- use correct host value in middleware ([#316](https://github.com/ory/elements/pull/316))

### ⚠️  Breaking Changes

- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))

### ❤️  Thank You

- aeneasr @aeneasr
- hackerman @aeneasr
- Jonas Hungershausen

## 1.0.0-next.0 (2025-01-03)

### 🚀 Features

- add page and app router examples ([#307](https://github.com/ory/elements/pull/307))
- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))
- add @ory/nextjs package ([#303](https://github.com/ory/elements/pull/303))

### 🩹 Fixes

- use correct host value in middleware ([#316](https://github.com/ory/elements/pull/316))

### ⚠️  Breaking Changes

- ⚠️  add getServerSession and SessionProvider ([#309](https://github.com/ory/elements/pull/309))

### ❤️  Thank You

- hackerman @aeneasr
- Jonas Hungershausen
