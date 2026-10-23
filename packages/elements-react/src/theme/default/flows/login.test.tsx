// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LoginFlowFromJSON } from "@ory/client-fetch"
import { render, screen } from "@testing-library/react"
import loginInitial from "../../../../.stub-responses/login/1fa/none/initial-form.json"
import { defaultConfiguration } from "../../../tests/jest/test-utils"
import { Login } from "./login"

const config = {
  ...defaultConfiguration,
  project: { ...defaultConfiguration.project, hide_ory_branding: true },
}

const components = { Card: { Header: () => null } }

test("should point the registration link at the base URL attached to the flow", () => {
  render(
    <Login
      flow={Object.assign(LoginFlowFromJSON(loginInitial), {
        ory_base_url: "https://attached.example.com",
      })}
      config={config}
      components={components}
    />,
  )

  expect(
    screen.getByTestId("ory/screen/login/action/register"),
  ).toHaveAttribute(
    "href",
    expect.stringMatching(
      /^https:\/\/attached\.example\.com\/self-service\/registration\/browser/,
    ),
  )
})
