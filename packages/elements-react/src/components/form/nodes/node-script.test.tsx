/**
 * @jest-environment-options {"resources":"usable"}
 */
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeAttributes } from "@ory/client-fetch"
import { act, cleanup, render, waitFor } from "@testing-library/react"
import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server.node"
import { OryComponentProvider } from "../../../context/component"
import { getOryComponents } from "../../../theme/default"
import { Node } from "./node"

type ScriptAttributes = Extract<UiNodeAttributes, { node_type: "script" }>

const attributes: ScriptAttributes = {
  node_type: "script",
  id: "webauthn-script-test",
  src: "https://identity.example.com/.well-known/ory/webauthn.js",
  type: "text/javascript",
  async: true,
  crossorigin: "anonymous",
  integrity: "sha256-example",
  referrerpolicy: "no-referrer",
  nonce: "flow-nonce",
}

let scriptIndex = 0

beforeEach(() => {
  attributes.src = `data:text/javascript,void(${++scriptIndex})`
})

function ScriptNode({
  scriptAttributes = attributes,
}: {
  scriptAttributes?: ScriptAttributes
}) {
  return (
    <OryComponentProvider components={getOryComponents()}>
      <Node
        node={{
          type: "script",
          group: "webauthn",
          attributes: scriptAttributes,
          messages: [],
          meta: {},
        }}
      />
    </OryComponentProvider>
  )
}

function scriptElement() {
  const element = document.getElementById(attributes.id)
  expect(element).toBeInstanceOf(HTMLScriptElement)
  if (!(element instanceof HTMLScriptElement)) {
    throw new Error("Expected the WebAuthn script to be inserted.")
  }
  return element
}

afterEach(() => {
  cleanup()
  document.head.replaceChildren()
  document.body.replaceChildren()
})

test("should leave script insertion to the client during server rendering", () => {
  expect(renderToString(<ScriptNode />)).toBe("")
})

test("should hydrate with the current document nonce and preserve SDK attributes", async () => {
  const bootstrap = document.createElement("script")
  bootstrap.setAttribute("nonce", "")
  Object.defineProperty(bootstrap, "nonce", { value: "document-nonce" })
  document.head.append(bootstrap)

  const container = document.createElement("div")
  container.innerHTML = renderToString(<ScriptNode />)
  document.body.append(container)
  const errors: unknown[] = []
  const root = hydrateRoot(container, <ScriptNode />, {
    onRecoverableError: (error) => errors.push(error),
  })

  try {
    await waitFor(() => expect(scriptElement().nonce).toBe("document-nonce"))
    const script = scriptElement()
    expect(script.src).toBe(attributes.src)
    expect(script.type).toBe(attributes.type)
    expect(script.async).toBe(attributes.async)
    expect(script.integrity).toBe(attributes.integrity)
    expect(script.crossOrigin).toBe(attributes.crossorigin)
    expect(script.referrerPolicy).toBe(attributes.referrerpolicy)
    expect(script.hasAttribute("node_type")).toBe(false)
    expect(errors).toEqual([])
  } finally {
    act(() => root.unmount())
  }
})

test("should preserve the flow nonce when the document has no nonce", () => {
  render(<ScriptNode />)
  expect(scriptElement().nonce).toBe(attributes.nonce)
})

test("should also insert scripts without a nonce", () => {
  render(<ScriptNode scriptAttributes={{ ...attributes, nonce: "" }} />)
  expect(scriptElement().nonce).toBe("")
})

test("should execute scripts inserted after the client mounts", async () => {
  render(
    <ScriptNode
      scriptAttributes={{
        ...attributes,
        src: "data:text/javascript,document.body.dataset.scriptExecuted='true'",
      }}
    />,
  )

  await waitFor(() => expect(document.body.dataset.scriptExecuted).toBe("true"))
  delete document.body.dataset.scriptExecuted
})

test("should share scripts across strict-mode mounts and remounts", () => {
  const first = render(
    <StrictMode>
      <ScriptNode />
      <ScriptNode />
    </StrictMode>,
  )
  const original = scriptElement()
  first.unmount()
  render(<ScriptNode />)

  expect(
    document.querySelectorAll(`script[id="${attributes.id}"]`),
  ).toHaveLength(1)
  expect(scriptElement()).toBe(original)
})

test("should let a remount retry a failed script", () => {
  const first = render(<ScriptNode />)
  const failed = scriptElement()
  failed.dispatchEvent(new Event("error"))
  expect(failed.isConnected).toBe(false)
  first.unmount()
  render(<ScriptNode />)

  expect(scriptElement()).not.toBe(failed)
})

test("should keep scripts with distinct integrity requirements separate", () => {
  render(
    <>
      <ScriptNode />
      <ScriptNode
        scriptAttributes={{ ...attributes, integrity: "sha256-other" }}
      />
    </>,
  )

  expect(
    document.querySelectorAll(`script[id="${attributes.id}"]`),
  ).toHaveLength(2)
})
