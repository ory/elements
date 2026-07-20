---
"@ory/elements-react": minor
"@ory/nextjs": minor
---

Add OAuth2 consent flow support. `@ory/nextjs` gains `getConsentFlow`, `acceptConsentRequest` and `rejectConsentRequest` for the app router, plus `getConsentFlow` and `useSession` for the pages router, validating that the active session identity matches the consent request subject. `@ory/elements-react` renders the OAuth2 client name and logo on the consent screen. The Next.js examples demonstrate CSRF protection for the consent endpoint using `@csrf-armor/nextjs`.
