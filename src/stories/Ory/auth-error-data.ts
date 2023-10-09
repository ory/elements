// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client"

export const authError400: FlowError = {
  id: "993c948b-6ac1-411c-bcaf-029f56b44d5e",
  error: {
    code: 400,
    debug:
      "key ory_kratos_oidc_auth_code_session does not exist in cookie: ory_kratos_continuity\n",
    message: "no resumable session found",
    reason:
      "The browser does not contain the necessary cookie to resume the session. This is a security violation and was blocked. Please clear your browser's cookies and cache and try again!",
    status: "Bad Request",
  },
  created_at: "2022-08-11T14:08:09.054554Z",
  updated_at: "2022-08-11T14:08:09.054554Z",
}

export const authError500: FlowError = {
  id: "993c948b-6ac1-411c-bcaf-029f56b44d5e",
  error: {
    code: 500,
    debug:
      "key ory_kratos_oidc_auth_code_session does not exist in cookie: ory_kratos_continuity\n",
    message: "no resumable session found",
    reason:
      "The browser does not contain the necessary cookie to resume the session. This is a security violation and was blocked. Please clear your browser's cookies and cache and try again!",
    status: "Bad Request",
  },
  created_at: "2022-08-11T14:08:09.054554Z",
  updated_at: "2022-08-11T14:08:09.054554Z",
}
