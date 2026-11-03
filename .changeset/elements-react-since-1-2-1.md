---
"@ory/elements-react": minor
---

Changes since 1.2.1:

- `OryProvider`, `Error`, and `Consent` use the Ory URL attached to a flow, error, or consent request (`ory_base_url`) ahead of `config.sdk.url`.
- `429 Too Many Requests` responses emit a `rate_limited` event on `onError`, and the pre-built forms show a rate-limit message.
- Add components for device authentication.
- The OAuth2 consent screen lists the resources the client requests.
- The one-time code input follows the configured code length and alphabet.
- The recovery form is prefilled with the identifier entered at login.
- "Choose another method" returns to the identifier step.
- Sign-up traits are kept when the user picks a social provider.
- The login form is enabled again when the Apple sign-in sheet is canceled.
- The form ref is attached to the default password input on React 18.
- The phone verification screen shows the correct instruction.
- A required consent checkbox left unchecked shows a clear error.
- Script nodes and the Turnstile captcha script load with the document's CSP nonce.
- The error page and card footer handle OAuth2 device flows.
- Messages missing from a locale render the English default, custom translations are merged in a single pass, and translations apply to Kratos messages with an empty list context. Adds missing organization SSO translations.
- Accepts any `@ory/client-fetch` 1.x release from 1.22.65.
- Ships version-matched agent guides and a slot map in `agents/`.
