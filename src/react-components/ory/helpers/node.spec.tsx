import { test, expect } from "@playwright/experimental-ct-react"
import { Node } from "./node"

test("hidden input field shouldn't show label", async ({ mount }) => {
  const component = await mount(
    <Node
      node={{
        group: "default",
        attributes: {
          name: "name",
          disabled: false,
          type: "hidden",
          node_type: "input",
          label: {
            type: "info",
            text: "Hidden input",
            id: 1234,
          },
        },
        messages: [],
        meta: {},
        type: "input",
      }}
    />,
  )

  await expect(component).toBeHidden()
})
