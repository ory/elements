// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { RecoveryFlow, RecoveryFlowFromJSON } from "@ory/client-fetch"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { StrictMode } from "react"
import recoveryV1Initial from "../../../../.stub-responses/recovery/code/initial-form.json"
import recoveryV2Initial from "../../../../.stub-responses/recovery-v2/code/initial-form.json"
import { defaultConfiguration } from "../../../tests/jest/test-utils"
import { rememberLastIdentifier } from "../../../util/lastIdentifier"
import { Recovery } from "./recovery"

const config = {
  ...defaultConfiguration,
  project: { ...defaultConfiguration.project, hide_ory_branding: true },
}

// The default header renders the current-identifier button, which pulls in the
// session client. Nothing in this test needs it.
const components = { Card: { Header: () => null } }

function renderRecovery(flow: RecoveryFlow) {
  return render(
    <Recovery flow={flow} config={config} components={components} />,
  )
}

function addressInput(name: string) {
  return screen.getByTestId<HTMLInputElement>(`ory/form/node/input/${name}`)
}

beforeEach(() => {
  window.sessionStorage.clear()
})

test("should show the last typed email in the recovery email field", () => {
  rememberLastIdentifier("jane@example.com")
  renderRecovery(RecoveryFlowFromJSON(recoveryV1Initial))

  expect(addressInput("email")).toHaveValue("jane@example.com")
})

test("should show the last typed phone number in the recovery address field", () => {
  rememberLastIdentifier("+4915112345678")
  renderRecovery(RecoveryFlowFromJSON(recoveryV2Initial))

  expect(addressInput("recovery_address")).toHaveValue("+4915112345678")
})

test("should leave the recovery email field empty when nothing was typed at login", () => {
  renderRecovery(RecoveryFlowFromJSON(recoveryV1Initial))

  expect(addressInput("email")).toHaveValue("")
})

test("should let the user replace the pre-filled recovery address", () => {
  rememberLastIdentifier("jane@example.com")
  renderRecovery(RecoveryFlowFromJSON(recoveryV1Initial))

  fireEvent.change(addressInput("email"), {
    target: { value: "john@example.com" },
  })

  expect(addressInput("email")).toHaveValue("john@example.com")
})

test("should not submit the recovery flow when pre-filling", () => {
  const originalFetch = global.fetch
  const fetchSpy = jest.fn()
  global.fetch = fetchSpy
  rememberLastIdentifier("jane@example.com")
  try {
    renderRecovery(RecoveryFlowFromJSON(recoveryV1Initial))

    expect(addressInput("email")).toHaveValue("jane@example.com")
    expect(fetchSpy).not.toHaveBeenCalled()
  } finally {
    global.fetch = originalFetch
  }
})

test("should submit the pre-filled recovery address when effects run twice", async () => {
  const originalFetch = global.fetch
  const fetchSpy = jest.fn().mockResolvedValue({
    status: 200,
    json: () => Promise.resolve(recoveryV2Initial),
  })
  global.fetch = fetchSpy
  rememberLastIdentifier("jane@example.com")
  try {
    render(
      <StrictMode>
        <Recovery
          flow={RecoveryFlowFromJSON(recoveryV2Initial)}
          config={config}
          components={components}
        />
      </StrictMode>,
    )
    expect(addressInput("recovery_address")).toHaveValue("jane@example.com")

    fireEvent.click(screen.getByRole("button", { name: /continue/i }))

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled())
    const [, init] = fetchSpy.mock.calls[0] as [unknown, { body: string }]
    expect(JSON.parse(init.body)).toMatchObject({
      recovery_address: "jane@example.com",
    })
  } finally {
    global.fetch = originalFetch
  }
})
