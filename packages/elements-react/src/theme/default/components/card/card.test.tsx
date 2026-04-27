// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryConfigurationProvider } from "@ory/elements-react"
import { render } from "@testing-library/react"
import { DefaultCard } from "./index"

// Replace the SVG modules used by <Badge />. The Jest `jest-transform-stub`
// turns SVG imports into empty strings, which React then treats as the
// element's tag name and JSDOM rejects with `InvalidCharacterError`. Mocking
// them with simple React components avoids that and lets us assert on the
// rendered DOM.
jest.mock(
  "../../assets/ory-badge-horizontal.svg",
  () =>
    function OryBadgeHorizontal() {
      return <svg data-testid="ory/card/badge/horizontal" />
    },
)
jest.mock(
  "../../assets/ory-badge-vertical.svg",
  () =>
    function OryBadgeVertical() {
      return <svg data-testid="ory/card/badge/vertical" />
    },
)

function renderCard(hideOryBranding: boolean | undefined) {
  return render(
    <OryConfigurationProvider
      sdk={{ url: "https://example.com" }}
      project={{ hide_ory_branding: hideOryBranding }}
    >
      <DefaultCard>content</DefaultCard>
    </OryConfigurationProvider>,
  )
}

describe("DefaultCard branding badge", () => {
  test("should render the Ory badge by default", () => {
    const { container } = renderCard(undefined)
    expect(container.querySelector("svg")).toBeTruthy()
  })

  test("should render the Ory badge when hide_ory_branding is false", () => {
    const { container } = renderCard(false)
    expect(container.querySelector("svg")).toBeTruthy()
  })

  test("should omit the Ory badge when hide_ory_branding is true", () => {
    const { container } = renderCard(true)
    expect(container.querySelector("svg")).toBeFalsy()
  })
})
