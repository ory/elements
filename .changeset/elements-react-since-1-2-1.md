---
"@ory/elements-react": minor
---

Changes since 1.2.1.

**New**

- **The Ory URL comes from the flow.** `OryProvider`, `Error`, and `Consent` use the `ory_base_url` attached to a flow, error, or consent request ahead of `config.sdk.url`. The framework adapters (`@ory/nextjs`, `@ory/react-router`, `@ory/tanstack-start`) attach it on the server, so a page renders `<Login flow={flow} config={config} />` without passing the URL separately. Without the field, nothing changes. See [Configuration](https://www.ory.com/docs/elements/guides/configuration).
- **Rate limits.** A `429 Too Many Requests` response no longer leaves the form frozen. The pre-built forms show a rate-limit message, and `onError` receives a `rate_limited` event:

  ```tsx
  <Login
    flow={flow}
    config={config}
    onError={(event) => {
      if (event.type === "rate_limited") {
        // Back off before letting the user retry.
      }
    }}
  />
  ```

- **Form busy state.** Forms render `aria-busy` and `data-busy="hydrating" | "submitting"` from the server render on, and the default theme dims the controls while a form is busy. Custom `Form.Root` components read the same state with [`useOryFormBusy()`](https://www.ory.com/docs/elements/reference/@ory/elements-react/functions/useOryFormBusy).
- **CAPTCHA.** The submit button stays enabled while Turnstile runs, and a submit waits for the token instead.
- **Device authentication.** The settings flow shows a device authentication section. Replace it through `Form.DeviceauthnSettings` in `components`.
- **Requested resources on the consent screen.** The OAuth2 consent screen lists the resource URLs the client requests. See [User login and consent flow](https://www.ory.com/docs/oauth2-oidc/custom-login-consent/flow).
- **One-time code format.** The code input follows the configured code length and alphabet. See [One-time code format](https://www.ory.com/docs/identities/sign-in/code-format).
- **Recovery prefill.** The recovery form is prefilled with the email or phone number entered at the identifier step of the login. The value is kept in `sessionStorage` and never appears in a URL. See [Pre-filled recovery address](https://www.ory.com/docs/elements/guides/recovery-prefill).
- **Translations.** A key missing from a locale renders the English default instead of the key. Custom translations are merged in a single pass and also apply to Kratos messages with an empty list context. Adds the organization SSO messages, "You must accept this to continue." (4000047), and "Please set up a second authentication factor to continue." (1050024). See [Use custom translations](https://www.ory.com/docs/elements/guides/internationalization).
- **Agent guides.** The package ships version-matched guides for coding agents and a map of its override slots in `agents/`.
- Accepts any `@ory/client-fetch` 1.x release from 1.22.65.

**Fixes**

- "Choose another method" in an identifier-first login returns to the identifier step instead of a chooser that only showed SSO buttons.
- Sign-up traits entered before choosing a social provider are kept.
- The login form is enabled again when the user cancels the Sign in with Apple sheet on iOS, iPadOS, or Safari on macOS.
- The form ref is attached to the default password input on React 18.
- The phone verification screen shows the correct instruction.
- A required consent checkbox that is left unchecked shows "You must accept this to continue." instead of "must be equal to constant true".
- Script nodes and the Turnstile script load with the page's CSP nonce.
- In the OAuth2 device flow, the consent screen no longer says that authorizing redirects to the client, and the error page shows device authorization errors. See [Device authorization](https://www.ory.com/docs/oauth2-oidc/device-authorization).
- The identifier button no longer receives an `inputmode` attribute.
