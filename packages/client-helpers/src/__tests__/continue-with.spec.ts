import { pickBestContinueWith } from "../continueWith"
import { ContinueWithRecoveryUi } from "@ory/client-fetch"
import { expect, test } from "@playwright/experimental-ct-react"

test("pickBestContinueWith", () => {
  const expected: ContinueWithRecoveryUi = {
    action: "show_recovery_ui",
    flow: {
      id: "1234",
    },
  }
  const result = pickBestContinueWith([
    {
      action: "set_ory_session_token",
      ory_session_token: "token",
    },
    expected,
  ])

  expect(result).toEqual(expected)
})
