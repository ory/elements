// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render } from "@testing-library/react"
import { CheckboxLabel } from "./checkbox-label"
import { IntlProvider } from "react-intl"
import { PropsWithChildren } from "react"

const wrapper = ({ children }: PropsWithChildren) => (
  <IntlProvider locale="en">{children}</IntlProvider>
)

describe("computeLabelElements", () => {
  test("renders plain text without links correctly", () => {
    const labelText = "This is just plain text"

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: "info" }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test("renders a text with a single markdown link correctly", () => {
    const labelText = "This is a [link](https://example.com)"

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: "info" }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test("renders a text with multiple markdown links correctly", () => {
    const labelText =
      "This [first link](https://first.com) and this [second link](https://second.com)"

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: "info" }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test("renders a text with link and extra text around it correctly", () => {
    const labelText =
      "Click [here](https://example.com) to visit, or go elsewhere."

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: "info" }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test("handles a label with no text but a link", () => {
    const labelText = "[Click here](https://example.com)"

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: "info" }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test("renders null if label is undefined", () => {
    const { container } = render(<CheckboxLabel label={undefined} />, {
      wrapper,
    })
    expect(container).toMatchSnapshot()
  })
})
