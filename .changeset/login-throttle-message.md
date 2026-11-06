---
"@ory/elements-react": minor
---

**Login throttling.** When brute-force protection refuses a login, the pre-built forms show "Too many failed login attempts. Please try again in 30 seconds." (4010012) instead of the generic rate-limit message. The `rate_limited` event that `onError` receives carries the Ory error as `body`. For a throttled login, `body.error.id` is `login_throttled` and `body.error.details.retry_after` holds the seconds until the user can try again.

Translations of a message whose context holds a `<name>_unix` timestamp can use `{<name>_unix_until_relative}`, the time left until that timestamp as a localized relative time such as "in 5 minutes".
