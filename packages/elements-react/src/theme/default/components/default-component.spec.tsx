// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getOryComponents } from "./default-components"

const CustomComponent = jest.fn()

describe("DefaultComponent", () => {
  test("can override card component", () => {
    const result = getOryComponents({
      Card: { AuthMethodListItem: CustomComponent },
    })
    expect(result.Card.AuthMethodListItem).toBe(CustomComponent)
    expect(result.Card.Content).toBeDefined()
  })
  test("can override form component", () => {
    const result = getOryComponents({
      Form: { SsoSettings: CustomComponent },
    })
    expect(result.Form.SsoSettings).toBe(CustomComponent)
    expect(result.Form.Root).toBeDefined()
  })
  test("can override message component", () => {
    const result = getOryComponents({
      Message: { Content: CustomComponent },
    })
    expect(result.Message.Content).toBe(CustomComponent)
    expect(result.Message.Root).toBeDefined()
  })
  test("can override page component", () => {
    const result = getOryComponents({
      Page: { Header: CustomComponent },
    })
    expect(result.Page.Header).toBe(CustomComponent)
  })
  test("can override node component", () => {
    const result = getOryComponents({
      Node: { Button: CustomComponent },
    })
    expect(result.Node.Button).toBe(CustomComponent)
    expect(result.Node.Input).toBeDefined()
  })
  test("can override consent scope checkbox component", () => {
    const result = getOryComponents({
      Node: { ConsentScopeCheckbox: CustomComponent },
    })
    expect(result.Node.ConsentScopeCheckbox).toBe(CustomComponent)
  })
})
