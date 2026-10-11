// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { provideOryFlow, useOryFlow } from "./useOryFlow"
import {
  FlowType,
  UiNodeGroupEnum,
  type LoginFlow,
  type RegistrationFlow,
  type SettingsFlow,
  type RecoveryFlow,
  type VerificationFlow,
} from "@ory/client-fetch"
import type { OryFlowContainer } from "../util/flowContainer"

// Test component that uses useOryFlow
const TestConsumer = defineComponent({
  setup() {
    const { flowContainer, formState, flowType, dispatchFormState } =
      useOryFlow()
    return { flowContainer, formState, flowType, dispatchFormState }
  },
  render() {
    return h(
      "div",
      {
        "data-testid": "consumer",
        "data-state": this.formState.current,
        "data-flow-type": this.flowType,
      },
      `State: ${this.formState.current}`,
    )
  },
})

// Helper to create provider wrapper
const createProvider = (container: OryFlowContainer) => {
  return defineComponent({
    setup() {
      return provideOryFlow(container)
    },
    render() {
      return h(TestConsumer)
    },
  })
}

// Helper to create mock flow container
function createMockFlowContainer(
  flowType: FlowType,
  overrides: Partial<
    | LoginFlow
    | RegistrationFlow
    | SettingsFlow
    | RecoveryFlow
    | VerificationFlow
  > = {},
): OryFlowContainer {
  const baseFlow = {
    id: "test-flow-id",
    type: flowType,
    ui: {
      action: "https://example.com/self-service/login",
      method: "POST",
      nodes: [],
      messages: [],
    },
    ...overrides,
  }

  return {
    flow: baseFlow as LoginFlow,
    flowType,
  }
}

describe("useOryFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("throws error when used outside provider", () => {
    expect(() => {
      mount(TestConsumer)
    }).toThrow(
      "useOryFlow must be used within a component that has called provideOryFlow",
    )
  })

  describe("parseStateFromFlow - Login", () => {
    it("returns provide_identifier for initial login flow", () => {
      const container = createMockFlowContainer(FlowType.Login)
      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='provide_identifier']").exists()).toBe(
        true,
      )
    })

    it("returns select_method for AAL2 (2FA) flow", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        requested_aal: "aal2",
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Totp,
              attributes: {
                name: "totp_code",
                type: "text",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
            {
              type: "input",
              group: UiNodeGroupEnum.LookupSecret,
              attributes: {
                name: "lookup_secret",
                type: "text",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
          ],
        },
      })

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='select_method']").exists()).toBe(true)
    })

    it("returns method_active when flow has active method", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        active: UiNodeGroupEnum.Password,
      })

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='method_active']").exists()).toBe(true)
    })

    it("returns method_active when method has messages", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Password,
              attributes: {
                name: "password",
                type: "password",
                node_type: "input",
              },
              messages: [
                { id: 4000006, type: "error", text: "Invalid credentials" },
              ],
              meta: {},
            },
          ],
        },
      })

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='method_active']").exists()).toBe(true)
    })

    it("returns select_method when identifier_first back button is present", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Default,
              attributes: {
                name: "screen",
                value: "previous",
                type: "submit",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
            {
              type: "input",
              group: UiNodeGroupEnum.Password,
              attributes: {
                name: "password",
                type: "password",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
            {
              type: "input",
              group: UiNodeGroupEnum.Code,
              attributes: { name: "code", type: "text", node_type: "input" },
              messages: [],
              meta: {},
            },
          ],
        },
      })

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='select_method']").exists()).toBe(true)
    })

    it("skips to method_active when only one non-code/passkey method available", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Default,
              attributes: {
                name: "screen",
                value: "previous",
                type: "submit",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
            {
              type: "input",
              group: UiNodeGroupEnum.Password,
              attributes: {
                name: "password",
                type: "password",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
          ],
        },
      })

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      // Should skip to method_active since only password is available
      expect(wrapper.find("[data-state='method_active']").exists()).toBe(true)
    })
  })

  describe("parseStateFromFlow - Registration", () => {
    it("returns provide_identifier for initial registration flow", () => {
      const container = createMockFlowContainer(FlowType.Registration)
      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='provide_identifier']").exists()).toBe(
        true,
      )
    })
  })

  describe("parseStateFromFlow - Settings", () => {
    it("returns settings state for settings flow", () => {
      const container = createMockFlowContainer(FlowType.Settings)
      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='settings']").exists()).toBe(true)
    })
  })

  describe("parseStateFromFlow - Recovery", () => {
    it("returns provide_identifier for choose_method state", () => {
      const container = createMockFlowContainer(FlowType.Recovery, {
        active: "code",
        state: "choose_method",
      } as Partial<RecoveryFlow>)

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='provide_identifier']").exists()).toBe(
        true,
      )
    })

    it("returns method_active for active code flow", () => {
      const container = createMockFlowContainer(FlowType.Recovery, {
        active: "code",
        state: "sent_email",
      } as Partial<RecoveryFlow>)

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='method_active']").exists()).toBe(true)
    })
  })

  describe("parseStateFromFlow - Verification", () => {
    it("returns provide_identifier for choose_method state", () => {
      const container = createMockFlowContainer(FlowType.Verification, {
        active: "code",
        state: "choose_method",
      } as Partial<VerificationFlow>)

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='provide_identifier']").exists()).toBe(
        true,
      )
    })

    it("returns method_active for active code flow", () => {
      const container = createMockFlowContainer(FlowType.Verification, {
        active: "code",
        state: "sent_email",
      } as Partial<VerificationFlow>)

      const Provider = createProvider(container)
      const wrapper = mount(Provider)

      expect(wrapper.find("[data-state='method_active']").exists()).toBe(true)
    })
  })

  describe("dispatchFormState", () => {
    it("action_select_method sets method_active state", async () => {
      const container = createMockFlowContainer(FlowType.Login, {
        requested_aal: "aal2",
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Totp,
              attributes: {
                name: "totp_code",
                type: "text",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
            {
              type: "input",
              group: UiNodeGroupEnum.LookupSecret,
              attributes: {
                name: "lookup_secret",
                type: "text",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
          ],
        },
      })

      let contextData: ReturnType<typeof provideOryFlow> | undefined

      const Provider = defineComponent({
        setup() {
          contextData = provideOryFlow(container)
        },
        render() {
          return h(TestConsumer)
        },
      })

      const wrapper = mount(Provider)

      // Initially select_method
      expect(wrapper.find("[data-state='select_method']").exists()).toBe(true)

      // Dispatch select method action
      contextData?.dispatchFormState({
        type: "action_select_method",
        method: UiNodeGroupEnum.Totp,
      })

      await wrapper.vm.$nextTick()

      expect(contextData?.formState.value.current).toBe("method_active")
      expect((contextData?.formState.value as { method: string }).method).toBe(
        UiNodeGroupEnum.Totp,
      )
    })

    it("action_clear_active_method returns to select_method", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        active: UiNodeGroupEnum.Password,
      })

      let contextData: ReturnType<typeof provideOryFlow> | undefined

      const Provider = defineComponent({
        setup() {
          contextData = provideOryFlow(container)
          // Select a method first
          contextData.dispatchFormState({
            type: "action_select_method",
            method: UiNodeGroupEnum.Totp,
          })
        },
        render() {
          return h(TestConsumer)
        },
      })

      mount(Provider)

      expect(contextData?.formState.value.current).toBe("method_active")

      // Clear the active method
      contextData?.dispatchFormState({ type: "action_clear_active_method" })

      expect(contextData?.formState.value.current).toBe("select_method")
    })
  })

  describe("setFlowContainer", () => {
    it("updates flow container and recalculates state", () => {
      const initialContainer = createMockFlowContainer(FlowType.Login)

      let contextData: ReturnType<typeof provideOryFlow> | undefined

      const Provider = defineComponent({
        setup() {
          contextData = provideOryFlow(initialContainer)
        },
        render() {
          return h(TestConsumer)
        },
      })

      mount(Provider)

      expect(contextData?.formState.value.current).toBe("provide_identifier")

      // Update to a flow with active method
      const newContainer = createMockFlowContainer(FlowType.Login, {
        active: UiNodeGroupEnum.Password,
      })

      contextData?.setFlowContainer(newContainer)

      expect(contextData?.formState.value.current).toBe("method_active")
    })

    it("preserves selected method when updating flow", () => {
      const container = createMockFlowContainer(FlowType.Login, {
        requested_aal: "aal2",
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Totp,
              attributes: {
                name: "totp_code",
                type: "text",
                node_type: "input",
              },
              messages: [],
              meta: {},
            },
          ],
        },
      })

      let contextData: ReturnType<typeof provideOryFlow> | undefined

      const Provider = defineComponent({
        setup() {
          contextData = provideOryFlow(container)
        },
        render() {
          return h(TestConsumer)
        },
      })

      mount(Provider)

      // Select a method
      contextData?.dispatchFormState({
        type: "action_select_method",
        method: UiNodeGroupEnum.Totp,
      })

      expect(contextData?.formState.value.current).toBe("method_active")

      // Update flow - should preserve selected method
      const newContainer = createMockFlowContainer(FlowType.Login, {
        requested_aal: "aal2",
        ui: {
          action: "https://example.com",
          method: "POST",
          nodes: [
            {
              type: "input",
              group: UiNodeGroupEnum.Totp,
              attributes: {
                name: "totp_code",
                type: "text",
                node_type: "input",
              },
              messages: [{ id: 4000008, type: "error", text: "Invalid code" }],
              meta: {},
            },
          ],
        },
      })

      contextData?.setFlowContainer(newContainer)

      // Should still be method_active with totp
      expect(contextData?.formState.value.current).toBe("method_active")
      expect((contextData?.formState.value as { method: string }).method).toBe(
        UiNodeGroupEnum.Totp,
      )
    })
  })
})
