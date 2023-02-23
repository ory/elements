export const oryIdentityErrors = [
  {
    id: 1010001,
    text: "Sign in",
    type: "info",
    context: {},
  },
  {
    id: 1010001,
    text: "Sign in with security key",
    type: "info",
    context: {},
  },
  {
    id: 1010002,
    text: "Sign in with {provider}",
    type: "info",
    context: {
      provider: "{provider}",
    },
  },
  {
    id: 1010003,
    text: "Please confirm this action by verifying that it is you.",
    type: "info",
    context: {},
  },
  {
    id: 1010004,
    text: "Please complete the second authentication challenge.",
    type: "info",
    context: {},
  },
  {
    id: 1010005,
    text: "Verify",
    type: "info",
    context: {},
  },
  {
    id: 1010006,
    text: "Authentication code",
    type: "info",
    context: {},
  },
  {
    id: 1010007,
    text: "Backup recovery code",
    type: "info",
    context: {},
  },
  {
    id: 1010008,
    text: "Use security key",
    type: "info",
  },
  {
    id: 1010009,
    text: "Use Authenticator",
    type: "info",
    context: {},
  },
  {
    id: 1010010,
    text: "Use backup recovery code",
    type: "info",
    context: {},
  },
  {
    id: 1010011,
    text: "Continue with security key",
    type: "info",
  },
  {
    id: 1010012,
    text: "Prepare your WebAuthn device (e.g. security key, biometrics scanner, ...) and press continue.",
    type: "info",
    context: {},
  },
  {
    id: 1010013,
    text: "Continue",
    type: "info",
  },
  {
    id: 1040001,
    text: "Sign up",
    type: "info",
    context: {},
  },
  {
    id: 1040002,
    text: "Sign up with {provider}",
    type: "info",
    context: {
      provider: "{provider}",
    },
  },
  {
    id: 1040003,
    text: "Continue",
    type: "info",
  },
  {
    id: 1040004,
    text: "Sign up with security key",
    type: "info",
  },
  {
    id: 1050001,
    text: "Your changes have been saved!",
    type: "success",
  },
  {
    id: 1050002,
    text: "Link {provider}",
    type: "info",
    context: {
      provider: "{provider}",
    },
  },
  {
    id: 1050003,
    text: "Unlink {provider}",
    type: "info",
    context: {
      provider: "{provider}",
    },
  },
  {
    id: 1050004,
    text: "Unlink TOTP Authenticator App",
    type: "info",
  },
  {
    id: 1050005,
    text: "Authenticator app QR code",
    type: "info",
  },
  {
    id: 1050006,
    text: "{secret}",
    type: "info",
    context: {
      secret: "{secret}",
    },
  },
  {
    id: 1050007,
    text: "Reveal backup recovery codes",
    type: "info",
  },
  {
    id: 1050008,
    text: "Generate new backup recovery codes",
    type: "info",
  },
  {
    id: 1050009,
    text: "{secret}",
    type: "info",
    context: {
      secret: "{secret}",
    },
  },
  {
    id: 1050010,
    text: "These are your back up recovery codes. Please keep them in a safe place!",
    type: "info",
  },
  {
    id: 1050011,
    text: "Confirm backup recovery codes",
    type: "info",
  },
  {
    id: 1050012,
    text: "Add security key",
    type: "info",
  },
  {
    id: 1050012,
    text: "Add security key",
    type: "info",
  },
  {
    id: 1050013,
    text: "Name of the security key",
    type: "info",
  },
  {
    id: 1050014,
    text: "Secret was used at 2020-01-01 00:59:59 +0000 UTC",
    type: "info",
    context: {
      used_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 1050015,
    text: "{code-1}, {code-2}",
    type: "info",
    context: {
      secrets: [
        {
          id: 1050009,
          text: "{code}",
          type: "info",
          context: {
            secret: "{code}",
          },
        },
        {
          id: 1050014,
          text: "Secret was used at 2020-01-01 00:59:59 +0000 UTC",
          type: "info",
          context: {
            used_at: "2020-01-01T00:59:59Z",
          },
        },
      ],
    },
  },
  {
    id: 1050016,
    text: "Disable this method",
    type: "info",
  },
  {
    id: 1050017,
    text: "This is your authenticator app secret. Use it if you can not scan the QR code.",
    type: "info",
  },
  {
    id: 1050018,
    text: 'Remove security key "{name}"',
    type: "info",
    context: {
      added_at: "2020-01-01T00:59:59Z",
      display_name: "{name}",
    },
  },
  {
    id: 1060001,
    text: "You successfully recovered your account. Please change your password or set up an alternative login method (e.g. social sign in) within the next 0.02 minutes.",
    type: "success",
    context: {
      privilegedSessionExpiresAt: "2020-01-01T01:01:00Z",
    },
  },
  {
    id: 1060002,
    text: "An email containing a recovery link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
    type: "info",
    context: {},
  },
  {
    id: 1060003,
    text: "An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
    type: "info",
    context: {},
  },
  {
    id: 1070001,
    text: "Password",
    type: "info",
  },
  {
    id: 1070002,
    text: "{title}",
    type: "info",
  },
  {
    id: 1070003,
    text: "Save",
    type: "info",
  },
  {
    id: 1070004,
    text: "ID",
    type: "info",
  },
  {
    id: 1070005,
    text: "Submit",
    type: "info",
  },
  {
    id: 1070006,
    text: "Verify code",
    type: "info",
  },
  {
    id: 1070007,
    text: "Email",
    type: "info",
  },
  {
    id: 1070008,
    text: "Resend code",
    type: "info",
  },
  {
    id: 1070009,
    text: "Continue",
    type: "info",
  },
  {
    id: 1080001,
    text: "An email containing a verification link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
    type: "info",
    context: {},
  },
  {
    id: 1080002,
    text: "You successfully verified your email address.",
    type: "success",
  },
  {
    id: 1080003,
    text: "An email containing a verification code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.",
    type: "info",
    context: {},
  },
  {
    id: 4000001,
    text: "{reason}",
    type: "error",
  },
  {
    id: 4000002,
    text: "Property {field} is missing.",
    type: "error",
    context: {
      property: "{field}",
    },
  },
  {
    id: 4000003,
    text: "length must be \u003e= 5, but got 3",
    type: "error",
    context: {},
  },
  {
    id: 4000004,
    text: 'does not match pattern "^[a-z]*$"',
    type: "error",
    context: {},
  },
  {
    id: 4000005,
    text: "The password can not be used because {reason}.",
    type: "error",
    context: {
      reason: "{reason}",
    },
  },
  {
    id: 4000006,
    text: "The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.",
    type: "error",
    context: {},
  },
  {
    id: 4000007,
    text: "An account with the same identifier (email, phone, username, ...) exists already.",
    type: "error",
    context: {},
  },
  {
    id: 4000008,
    text: "The provided authentication code is invalid, please try again.",
    type: "error",
    context: {},
  },
  {
    id: 4000009,
    text: "Could not find any login identifiers. Did you forget to set them? This could also be caused by a server misconfiguration.",
    type: "error",
  },
  {
    id: 4000010,
    text: "Account not active yet. Did you forget to verify your email address?",
    type: "error",
  },
  {
    id: 4000011,
    text: "You have no TOTP device set up.",
    type: "error",
    context: {},
  },
  {
    id: 4000012,
    text: "This backup recovery code has already been used.",
    type: "error",
    context: {},
  },
  {
    id: 4000013,
    text: "You have no WebAuthn device set up.",
    type: "error",
    context: {},
  },
  {
    id: 4000014,
    text: "You have no backup recovery codes set up.",
    type: "error",
    context: {},
  },
  {
    id: 4000015,
    text: "This account does not exist or has no security key set up.",
    type: "error",
    context: {},
  },
  {
    id: 4000016,
    text: "The backup recovery code is not valid.",
    type: "error",
    context: {},
  },
  {
    id: 4000017,
    text: "length must be \u003c= 5, but got 6",
    type: "error",
    context: {},
  },
  {
    id: 4000018,
    text: "must be \u003e= 5 but found 3",
    type: "error",
    context: {},
  },
  {
    id: 4000019,
    text: "must be \u003e 5 but found 5",
    type: "error",
    context: {},
  },
  {
    id: 4000020,
    text: "must be \u003c= 5 but found 6",
    type: "error",
    context: {},
  },
  {
    id: 4000021,
    text: "must be \u003c 5 but found 5",
    type: "error",
    context: {},
  },
  {
    id: 4000022,
    text: "7 not multipleOf 3",
    type: "error",
    context: {},
  },
  {
    id: 4000023,
    text: "maximum 3 items allowed, but found 4 items",
    type: "error",
    context: {},
  },
  {
    id: 4000024,
    text: "minimum 3 items allowed, but found 2 items",
    type: "error",
    context: {},
  },
  {
    id: 4000025,
    text: "items at index 0 and 2 are equal",
    type: "error",
    context: {},
  },
  {
    id: 4000026,
    text: "expected number, but got string",
    type: "error",
    context: {},
  },
  {
    id: 4010001,
    text: "The login flow expired 1.02 minutes ago, please try again.",
    type: "error",
    context: {
      expired_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 4010002,
    text: "Could not find a strategy to log you in with. Did you fill out the form correctly?",
    type: "error",
  },
  {
    id: 4010003,
    text: "Could not find a strategy to sign you up with. Did you fill out the form correctly?",
    type: "error",
  },
  {
    id: 4010004,
    text: "Could not find a strategy to update your settings. Did you fill out the form correctly?",
    type: "error",
  },
  {
    id: 4010005,
    text: "Could not find a strategy to recover your account with. Did you fill out the form correctly?",
    type: "error",
  },
  {
    id: 4010006,
    text: "Could not find a strategy to verify your account with. Did you fill out the form correctly?",
    type: "error",
  },
  {
    id: 4040001,
    text: "The registration flow expired -0.02 minutes ago, please try again.",
    type: "error",
    context: {
      expired_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 4050001,
    text: "The settings flow expired -0.02 minutes ago, please try again.",
    type: "error",
    context: {
      expired_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 4060001,
    text: "The request was already completed successfully and can not be retried.",
    type: "error",
    context: {},
  },
  {
    id: 4060002,
    text: "The recovery flow reached a failure state and must be retried.",
    type: "error",
    context: {},
  },
  {
    id: 4060004,
    text: "The recovery token is invalid or has already been used. Please retry the flow.",
    type: "error",
    context: {},
  },
  {
    id: 4060005,
    text: "The recovery flow expired -0.02 minutes ago, please try again.",
    type: "error",
    context: {
      expired_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 4060006,
    text: "The recovery code is invalid or has already been used. Please try again.",
    type: "error",
    context: {},
  },
  {
    id: 4070001,
    text: "The verification token is invalid or has already been used. Please retry the flow.",
    type: "error",
    context: {},
  },
  {
    id: 4070002,
    text: "The request was already completed successfully and can not be retried.",
    type: "error",
    context: {},
  },
  {
    id: 4070003,
    text: "The verification flow reached a failure state and must be retried.",
    type: "error",
    context: {},
  },
  {
    id: 4070005,
    text: "The verification flow expired -0.02 minutes ago, please try again.",
    type: "error",
    context: {
      expired_at: "2020-01-01T00:59:59Z",
    },
  },
  {
    id: 4070006,
    text: "The verification code is invalid or has already been used. Please try again.",
    type: "error",
    context: {},
  },
  {
    id: 5000001,
    text: "{reason}",
    type: "error",
    context: {},
  },
]
