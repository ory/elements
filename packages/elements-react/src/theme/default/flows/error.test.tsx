// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render, screen } from "@testing-library/react"
import { defaultConfiguration } from "../../../tests/jest/test-utils"
import { Error as ErrorCard, OryError } from "./error"

jest.mock("../utils/logout", () => ({
  useClientLogout: jest.fn(() => ({ logoutFlow: undefined, didLoad: true })),
}))

// The Ory badge pulls in an SVG, which jest stubs out into an element with no
// tag name.
const config = {
  ...defaultConfiguration,
  project: { ...defaultConfiguration.project, hide_ory_branding: true },
}

function renderError(error: OryError) {
  return render(<ErrorCard error={error} config={config} />)
}

describe("Error", () => {
  const declinedCodes = [
    "user_rejected_consent",
    "request_denied",
    "consent request denied",
    "login request denied",
  ]

  for (const code of declinedCodes) {
    test(`should leave out the retry and report guidance for ${code}`, () => {
      renderError({
        error: code,
        error_description: "The request was rejected.",
      })

      expect(screen.getByTestId("ory/screen/error")).toBeInTheDocument()
      expect(screen.getByText("The request was rejected.")).toBeInTheDocument()
      expect(
        screen.queryByTestId("ory/screen/error/instructions"),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId("ory/screen/error/report"),
      ).not.toBeInTheDocument()
    })
  }

  test("should leave out the empty action section when there is nothing to do", () => {
    const { default_redirect_url: _, ...project } = config.project
    render(
      <ErrorCard
        error={{ error: "request_denied", error_description: "Rejected." }}
        // ProjectConfiguration declares default_redirect_url as required, so
        // a project without one is only reachable through an assertion, while
        // the SDK can answer without it and then there is no action to render.
        config={{ ...config, project } as unknown as typeof config}
      />,
    )

    expect(screen.getByText("Rejected.")).toBeInTheDocument()
    expect(screen.queryByText("What can I do?")).not.toBeInTheDocument()
  })

  // Ory answers a stale, reused or unknown verifier with access_denied, so the
  // RFC code on its own does not mean the end user decided anything.
  test("should keep the retry and report guidance for access_denied", () => {
    renderError({
      error: "access_denied",
      error_description: "The consent verifier has already been used.",
    })

    expect(
      screen.getByTestId("ory/screen/error/instructions"),
    ).toBeInTheDocument()
    expect(screen.getByTestId("ory/screen/error/report")).toBeInTheDocument()
  })

  test("should keep the retry and report guidance for a real error", () => {
    renderError({
      error: "server_error",
      error_description: "Something went wrong.",
    })

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
    expect(
      screen.getByTestId("ory/screen/error/instructions"),
    ).toBeInTheDocument()
    expect(screen.getByTestId("ory/screen/error/report")).toBeInTheDocument()
  })

  test("should keep the retry and report guidance for a flow error", () => {
    renderError({
      id: "flow-error-id",
      created_at: new Date("2026-09-11T00:00:00Z"),
      updated_at: new Date("2026-09-11T00:00:00Z"),
      error: { code: 500, message: "Internal error", reason: "a reason" },
    } as unknown as OryError)

    expect(
      screen.getByTestId("ory/screen/error/instructions"),
    ).toBeInTheDocument()
    expect(screen.getByTestId("ory/screen/error/report")).toBeInTheDocument()
  })
})
