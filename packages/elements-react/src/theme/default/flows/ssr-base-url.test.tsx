// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ApiResponse,
  FlowType,
  LoginFlow,
  LoginFlowFromJSON,
  Session,
} from "@ory/client-fetch"
import { resolveError, resolveFlow } from "@ory/ssr"
import { render, screen } from "@testing-library/react"
import loginInitial from "../../../../.stub-responses/login/1fa/none/initial-form.json"
import { defaultConfiguration } from "../../../tests/jest/test-utils"
import { useClientLogout } from "../utils/logout"
import { Error as ErrorCard } from "./error"
import { Login } from "./login"

jest.mock("../utils/logout", () => ({
  useClientLogout: jest.fn(() => ({ logoutFlow: undefined, didLoad: true })),
}))

const config = {
  ...defaultConfiguration,
  project: { ...defaultConfiguration.project, hide_ory_branding: true },
}

const baseUrl = "https://attached.example.com"

test("Login uses the base URL that @ory/ssr attaches to the flow", async () => {
  const result = await resolveFlow<LoginFlow>(
    FlowType.Login,
    { flow: loginInitial.id },
    () =>
      Promise.resolve({
        value: () => Promise.resolve(LoginFlowFromJSON(loginInitial)),
      } as ApiResponse<LoginFlow>),
    { baseUrl, route: "/login" },
  )
  if (!("flow" in result) || !result.flow) {
    throw new Error("expected a flow")
  }

  render(
    <Login
      flow={result.flow}
      config={config}
      components={{ Card: { Header: () => null } }}
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

test("Error uses the base URL that @ory/ssr attaches to the error", async () => {
  const error = await resolveError({ error: "server_error" }, jest.fn(), {
    baseUrl,
  })

  render(
    <ErrorCard
      error={error}
      config={config}
      session={{ id: "session-id" } as Session}
    />,
  )

  expect(useClientLogout).toHaveBeenCalledWith(
    expect.objectContaining({
      sdk: expect.objectContaining({ url: baseUrl }),
    }),
  )
})
