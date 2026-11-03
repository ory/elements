// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeInputProps } from "@ory/elements-react"
import { render } from "@testing-library/react"
import { DefaultInput } from "./input"

jest.mock("@ory/elements-react", (): unknown => ({
  ...jest.requireActual("@ory/elements-react"),
  useOryFlow: jest.fn(() => ({ flowType: "login" })),
}))
jest.mock("../../assets/icons/eye.svg", () => StubIcon())
jest.mock("../../assets/icons/eye-off.svg", () => StubIcon())

function StubIcon() {
  return function StubIcon() {
    return <svg />
  }
}

function renderInput(type: string) {
  const ref = jest.fn()
  const props = {
    inputProps: {
      id: type,
      name: type,
      type,
      value: undefined,
      onClick: jest.fn(),
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref,
    },
    node: { attributes: { name: type, type, disabled: false } },
  } as unknown as OryNodeInputProps
  const { container } = render(<DefaultInput {...props} />)
  return { ref, input: container.querySelector(`input[name="${type}"]`) }
}

const inputTypes = ["password", "text", "hidden"]
inputTypes.forEach((type) => {
  test(`should attach the form ref to the ${type} input element`, () => {
    const { ref, input } = renderInput(type)
    expect(input).toBeInstanceOf(HTMLInputElement)
    expect(ref).toHaveBeenCalledWith(input)
  })
})
