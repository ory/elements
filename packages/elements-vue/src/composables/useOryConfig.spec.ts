// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { defineComponent, h } from "vue"
import { provideOryConfig, useOryConfig } from "./useOryConfig"

// Test component that uses useOryConfig
const TestConsumer = defineComponent({
  setup() {
    const config = useOryConfig()
    return { config }
  },
  render() {
    return h(
      "div",
      {
        "data-testid": "consumer",
        "data-sdk-url": this.config.sdk.url,
        "data-project-name": this.config.project.name,
      },
      `SDK: ${this.config.sdk.url}, Project: ${this.config.project.name}`,
    )
  },
})

describe("useOryConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("throws error when used outside provider", () => {
    expect(() => {
      mount(TestConsumer)
    }).toThrow(
      "useOryConfig must be used within a component that has called provideOryConfig",
    )
  })

  it("provides default configuration", () => {
    // Mock window.location.origin
    vi.stubGlobal("window", { location: { origin: "https://localhost:3000" } })

    const Provider = defineComponent({
      setup() {
        provideOryConfig()
      },
      render() {
        return h(TestConsumer)
      },
    })

    const wrapper = mount(Provider)

    expect(wrapper.find("[data-sdk-url]").attributes("data-sdk-url")).toBe(
      "https://localhost:3000",
    )
    expect(
      wrapper.find("[data-project-name]").attributes("data-project-name"),
    ).toBe("Ory")
  })

  it("uses custom SDK URL when provided", () => {
    const customUrl = "https://custom.ory.sh"

    const Provider = defineComponent({
      setup() {
        provideOryConfig({
          sdk: { url: customUrl },
        })
      },
      render() {
        return h(TestConsumer)
      },
    })

    const wrapper = mount(Provider)

    expect(wrapper.find("[data-sdk-url]").attributes("data-sdk-url")).toBe(
      customUrl,
    )
  })

  it("merges custom project config with defaults", () => {
    const Provider = defineComponent({
      setup() {
        provideOryConfig({
          sdk: { url: "https://example.com" },
          project: {
            name: "My Custom App",
            registration_enabled: false,
          },
        })
      },
      render() {
        return h(TestConsumer)
      },
    })

    const wrapper = mount(Provider)

    expect(
      wrapper.find("[data-project-name]").attributes("data-project-name"),
    ).toBe("My Custom App")
  })

  it("provides FrontendApi client", () => {
    let configValue: ReturnType<typeof useOryConfig> | undefined

    const Consumer = defineComponent({
      setup() {
        configValue = useOryConfig()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideOryConfig({
          sdk: { url: "https://example.com" },
        })
      },
      render() {
        return h(Consumer)
      },
    })

    mount(Provider)

    expect(configValue?.sdk.frontend).toBeDefined()
    expect(typeof configValue?.sdk.frontend.toSession).toBe("function")
  })

  it("includes default project URLs", () => {
    let configValue: ReturnType<typeof useOryConfig> | undefined

    const Consumer = defineComponent({
      setup() {
        configValue = useOryConfig()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideOryConfig({
          sdk: { url: "https://example.com" },
        })
      },
      render() {
        return h(Consumer)
      },
    })

    mount(Provider)

    expect(configValue?.project.login_ui_url).toBe("/ui/login")
    expect(configValue?.project.registration_ui_url).toBe("/ui/registration")
    expect(configValue?.project.recovery_ui_url).toBe("/ui/recovery")
    expect(configValue?.project.verification_ui_url).toBe("/ui/verification")
    expect(configValue?.project.settings_ui_url).toBe("/ui/settings")
    expect(configValue?.project.error_ui_url).toBe("/ui/error")
    expect(configValue?.project.default_redirect_url).toBe("/ui/welcome")
  })

  it("allows overriding default project URLs", () => {
    let configValue: ReturnType<typeof useOryConfig> | undefined

    const Consumer = defineComponent({
      setup() {
        configValue = useOryConfig()
      },
      render() {
        return h("div")
      },
    })

    const Provider = defineComponent({
      setup() {
        provideOryConfig({
          sdk: { url: "https://example.com" },
          project: {
            login_ui_url: "/custom/login",
            default_redirect_url: "/dashboard",
          },
        })
      },
      render() {
        return h(Consumer)
      },
    })

    mount(Provider)

    expect(configValue?.project.login_ui_url).toBe("/custom/login")
    expect(configValue?.project.default_redirect_url).toBe("/dashboard")
    // Other defaults should still be present
    expect(configValue?.project.registration_ui_url).toBe("/ui/registration")
  })
})
