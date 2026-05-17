// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { fireEvent, screen } from "@testing-library/react"
import { IntlProvider } from "../../../../context/intl-context"
import type { LocaleMap } from "../../../../locales"
import { renderWithOryElements } from "../../../../tests/jest/test-utils"
import { Node } from "../node"

beforeEach(() => {
  console.log = jest.fn()
  console.warn = jest.fn()
  console.error = jest.fn()
})

function renderCountrySelect(
  options?: unknown[],
  required = true,
  customTranslations?: Partial<LocaleMap>,
) {
  return renderWithOryElements(
    <IntlProvider locale="en" customTranslations={customTranslations}>
      <Node
        node={{
          type: "input",
          group: "profile",
          attributes: {
            name: "traits.country",
            type: "text",
            required,
            disabled: false,
            node_type: "input",
            options: options ?? [
              { value: "US" },
              { value: "UK" },
              { value: "DE" },
              { value: "AT" },
            ],
            // `options` is not yet declared on the SDK type, so widen via
            // `unknown` to bypass the structural check until
            // `@ory/client-fetch` carries the field natively.
          } as unknown as never,
          messages: [],
          meta: {
            label: {
              id: 1070002,
              text: "Country",
              type: "info",
              context: {
                name: "traits.country",
                title: "Country",
              },
            },
          },
        }}
      />
    </IntlProvider>,
  )
}

function getSelectByTestId(testId: string): HTMLSelectElement {
  const el = screen.getByTestId(testId)
  if (!(el instanceof HTMLSelectElement)) {
    throw new Error(`expected ${testId} to be a <select> element`)
  }
  return el
}

test("should render a native <select> with one option per enum value", () => {
  renderCountrySelect()

  const select = getSelectByTestId("ory/form/node/input/traits.country")
  expect(select.tagName).toBe("SELECT")

  // The empty placeholder option is marked `hidden` so it is not exposed via
  // the "option" role. Only the four enum entries are assertive here.
  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options).toHaveLength(4)
  expect(options.map((o) => o.value)).toEqual(["US", "UK", "DE", "AT"])
})

test("should update the underlying form value when an option is selected", () => {
  renderCountrySelect()

  const select = getSelectByTestId("ory/form/node/input/traits.country")

  fireEvent.change(select, { target: { value: "DE" } })

  expect(select.value).toBe("DE")
})

test("should fall back to the raw value when no translation is registered", () => {
  renderCountrySelect([{ value: "US" }, { value: "DE" }, { value: "XX" }])

  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options).toHaveLength(3)
  expect(options.map((o) => o.value)).toEqual(["US", "DE", "XX"])
  expect(options.map((o) => o.text)).toEqual(["US", "DE", "XX"])
})

test("should coerce non-string option values to strings for the <option> value attribute", () => {
  renderCountrySelect([{ value: 1 }, { value: 2 }, { value: 3 }])

  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options.map((o) => o.value)).toEqual(["1", "2", "3"])
})

test("should keep the empty option selectable for non-required fields so users can clear their pick", () => {
  renderCountrySelect(undefined, false)

  // For optional selects the empty placeholder is enabled and visible, so it
  // shows up as a 5th option (placeholder + 4 enum entries) and can be
  // selected to clear the value again.
  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options).toHaveLength(5)
  const placeholder = options[0]
  expect(placeholder.value).toBe("")
  expect(placeholder.disabled).toBe(false)
  expect(placeholder.hidden).toBe(false)

  const select = getSelectByTestId("ory/form/node/input/traits.country")
  fireEvent.change(select, { target: { value: "DE" } })
  expect(select.value).toBe("DE")
  fireEvent.change(select, { target: { value: "" } })
  expect(select.value).toBe("")
})

test("should localize option labels through customTranslations using the `forms.option.<name>.<value>` convention", () => {
  renderCountrySelect(undefined, true, {
    en: {
      "forms.option.traits.country.US": "United States",
      "forms.option.traits.country.DE": "Germany",
    },
  })

  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options.map((o) => o.text)).toEqual([
    "United States",
    "UK",
    "Germany",
    "AT",
  ])
  // Underlying form values stay on the raw enum keys so the submitted
  // payload does not depend on the user's locale.
  expect(options.map((o) => o.value)).toEqual(["US", "UK", "DE", "AT"])
})

test("should hide the empty option for required fields so the user must pick a value", () => {
  renderCountrySelect(undefined, true)

  // For required selects the empty placeholder is disabled+hidden, so only
  // the 4 real enum entries are exposed via the option role.
  const options = screen.getAllByRole<HTMLOptionElement>("option")
  expect(options).toHaveLength(4)
})
