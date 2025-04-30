// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, isUiNodeInputAttributes } from "@ory/client-fetch"
import { defaultNodeSorter } from "./component"

import captchaFormData from "../../.stub-responses/login/1fa/identifier_first/captcha/initial-form.json"
import passwordFormData from "../../.stub-responses/login/1fa/unified/password/initial-form.json"
import registrationData from "../../.stub-responses/registration/one-step/captcha/initial-form.json"
import registrationDataTwoStep from "../../.stub-responses/registration/two-step/captcha/initial-form.json"

describe("defaultNodeSorter", () => {
  it("correctly sorts nodes from captcha form response", () => {
    // Load test data from stub file
    const nodes: UiNode[] = captchaFormData.ui.nodes as UiNode[]

    // Sort the nodes
    const sortedNodes = [...nodes].sort(defaultNodeSorter)

    // Create a simplified representation for the snapshot
    const nodeOrder = sortedNodes.map((node) => ({
      group: node.group,
      type: node.attributes.node_type,
      inputType: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.type
        : undefined,
      name: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.name
        : undefined,
    }))

    // Snapshot test for consistent ordering
    expect(nodeOrder).toMatchSnapshot("captcha form node order")

    // Find captcha nodes and submit buttons to verify ordering
    const captchaNodes = sortedNodes.filter((node) => node.group === "captcha")
    const submitButtons = sortedNodes.filter(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === "submit",
    )

    if (captchaNodes.length > 0 && submitButtons.length > 0) {
      const lastCaptchaIndex = sortedNodes.indexOf(
        captchaNodes[captchaNodes.length - 1],
      )
      const firstSubmitIndex = sortedNodes.indexOf(submitButtons[0])

      // This test should now pass with the fixed node sorter
      expect(lastCaptchaIndex).toBeLessThan(firstSubmitIndex)
    }
  })

  it("correctly sorts nodes from unified password form response", () => {
    // Load test data from stub file
    const nodes: UiNode[] = passwordFormData.ui.nodes as UiNode[]

    // Sort the nodes
    const sortedNodes = [...nodes].sort(defaultNodeSorter)

    // Create a simplified representation for the snapshot
    const nodeOrder = sortedNodes.map((node) => ({
      group: node.group,
      type: node.attributes.node_type,
      inputType: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.type
        : undefined,
      name: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.name
        : undefined,
    }))

    // Snapshot test for consistent ordering
    expect(nodeOrder).toMatchSnapshot("unified password form node order")

    // Verify captcha nodes come before submit buttons
    const captchaNodes = sortedNodes.filter((node) => node.group === "captcha")
    const submitButtons = sortedNodes.filter(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === "submit",
    )

    if (captchaNodes.length > 0 && submitButtons.length > 0) {
      const lastCaptchaIndex = sortedNodes.indexOf(
        captchaNodes[captchaNodes.length - 1],
      )
      const firstSubmitIndex = sortedNodes.indexOf(submitButtons[0])

      // This test should now pass with the fixed sorter
      expect(lastCaptchaIndex).toBeLessThan(firstSubmitIndex)
    }
  })

  it("correctly sorts nodes from one-step registration with captcha", () => {
    // Load test data from stub file
    const nodes: UiNode[] = registrationData.ui.nodes as UiNode[]

    // Sort the nodes
    const sortedNodes = [...nodes].sort(defaultNodeSorter)

    // Create a simplified representation for the snapshot
    const nodeOrder = sortedNodes.map((node) => ({
      group: node.group,
      type: node.attributes.node_type,
      inputType: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.type
        : undefined,
      name: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.name
        : undefined,
    }))

    // Snapshot test for consistent ordering
    expect(nodeOrder).toMatchSnapshot(
      "one-step registration with captcha node order",
    )

    // Verify captcha nodes come before submit buttons
    const captchaNodes = sortedNodes.filter((node) => node.group === "captcha")
    const submitButtons = sortedNodes.filter(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === "submit",
    )

    if (captchaNodes.length > 0 && submitButtons.length > 0) {
      const lastCaptchaIndex = sortedNodes.indexOf(
        captchaNodes[captchaNodes.length - 1],
      )
      const firstSubmitIndex = sortedNodes.indexOf(submitButtons[0])

      expect(lastCaptchaIndex).toBeLessThan(firstSubmitIndex)
    }
  })

  it("correctly sorts nodes from two-step registration with captcha", () => {
    // Load test data from stub file
    const nodes: UiNode[] = registrationDataTwoStep.ui.nodes as UiNode[]

    // Sort the nodes
    const sortedNodes = [...nodes].sort(defaultNodeSorter)

    // Create a simplified representation for the snapshot
    const nodeOrder = sortedNodes.map((node) => ({
      group: node.group,
      type: node.attributes.node_type,
      inputType: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.type
        : undefined,
      name: isUiNodeInputAttributes(node.attributes)
        ? node.attributes.name
        : undefined,
    }))

    // Snapshot test for consistent ordering
    expect(nodeOrder).toMatchSnapshot(
      "two-step registration with captcha node order",
    )

    // Verify captcha nodes come before submit buttons
    const captchaNodes = sortedNodes.filter((node) => node.group === "captcha")
    const submitButtons = sortedNodes.filter(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === "submit",
    )

    if (captchaNodes.length > 0 && submitButtons.length > 0) {
      const lastCaptchaIndex = sortedNodes.indexOf(
        captchaNodes[captchaNodes.length - 1],
      )
      const firstSubmitIndex = sortedNodes.indexOf(submitButtons[0])

      expect(lastCaptchaIndex).toBeLessThan(firstSubmitIndex)
    }
  })
})
