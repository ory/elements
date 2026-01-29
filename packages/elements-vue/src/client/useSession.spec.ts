// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { mount, flushPromises } from "@vue/test-utils"
import { defineComponent, h, nextTick } from "vue"
import { provideSession, useSession } from "./useSession"
import type { Session } from "@ory/client-fetch"

// Mock the frontendClient
vi.mock("../util/client", () => ({
  frontendClient: vi.fn(() => ({
    toSession: vi.fn(),
  })),
}))

import { frontendClient } from "../util/client"

const mockSession: Session = {
  id: "test-session-id",
  identity: {
    id: "test-identity-id",
    traits: { email: "test@example.com" },
    schema_id: "default",
    schema_url: "https://example.com/schema",
  },
  active: true,
  expires_at: new Date().toISOString(),
}

// Test component that uses useSession
const TestConsumer = defineComponent({
  setup() {
    const { isLoading, session, error, initialized } = useSession()
    return { isLoading, session, error, initialized }
  },
  render() {
    if (this.isLoading)
      return h("div", { "data-testid": "loading" }, "Loading...")
    if (this.error)
      return h(
        "div",
        { "data-testid": "error" },
        `Error: ${this.error.message}`,
      )
    if (this.session)
      return h(
        "div",
        { "data-testid": "session" },
        `Session: ${this.session.id}`,
      )
    return h("div", { "data-testid": "no-session" }, "No session")
  },
})

// Provider wrapper component
const createProvider = (options: Parameters<typeof provideSession>[0] = {}) => {
  return defineComponent({
    setup() {
      provideSession(options)
    },
    render() {
      return h(TestConsumer)
    },
  })
}

describe("useSession", () => {
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
      "[Ory/Elements] useSession must be used within a component where provideSession has been called",
    )
  })

  it("shows session immediately when provided via SSR", () => {
    const Provider = createProvider({ session: mockSession })
    const wrapper = mount(Provider)

    expect(wrapper.find("[data-testid='session']").exists()).toBe(true)
    expect(wrapper.text()).toContain(`Session: ${mockSession.id}`)

    // Should not fetch since session was provided
    expect(frontendClient).not.toHaveBeenCalled()
  })

  it("fetches session automatically when not provided", async () => {
    const mockToSession = vi.fn().mockResolvedValue(mockSession)
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    const Provider = createProvider()
    const wrapper = mount(Provider)

    // Initially loading
    expect(wrapper.find("[data-testid='loading']").exists()).toBe(true)

    // Wait for fetch to complete
    await flushPromises()
    await nextTick()

    expect(wrapper.find("[data-testid='session']").exists()).toBe(true)
    expect(wrapper.text()).toContain(`Session: ${mockSession.id}`)
    expect(mockToSession).toHaveBeenCalledTimes(1)
  })

  it("handles errors during session fetching", async () => {
    const errorMessage = "Failed to fetch session"
    const mockToSession = vi.fn().mockRejectedValue(new Error(errorMessage))
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    const Provider = createProvider()
    const wrapper = mount(Provider)

    // Initially loading
    expect(wrapper.find("[data-testid='loading']").exists()).toBe(true)

    // Wait for fetch to complete
    await flushPromises()
    await nextTick()

    expect(wrapper.find("[data-testid='error']").exists()).toBe(true)
    expect(wrapper.text()).toContain(`Error: ${errorMessage}`)
  })

  it("does not fetch if session is provided", async () => {
    const mockToSession = vi.fn()
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    const Provider = createProvider({ session: mockSession })
    mount(Provider)

    await flushPromises()

    expect(mockToSession).not.toHaveBeenCalled()
  })

  it("sets initialized to true after fetch completes", async () => {
    const mockToSession = vi.fn().mockResolvedValue(mockSession)
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    let contextData: ReturnType<typeof provideSession> | undefined

    const Provider = defineComponent({
      setup() {
        contextData = provideSession()
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    // Initially not initialized (no session provided)
    expect(contextData?.initialized.value).toBe(false)

    await flushPromises()
    await nextTick()

    // After fetch, should be initialized
    expect(contextData?.initialized.value).toBe(true)
  })

  it("sets initialized to true immediately when session is provided", () => {
    let contextData: ReturnType<typeof provideSession> | undefined

    const Provider = defineComponent({
      setup() {
        contextData = provideSession({ session: mockSession })
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    expect(contextData?.initialized.value).toBe(true)
  })

  it("can refetch session", async () => {
    const mockToSession = vi.fn().mockResolvedValue(mockSession)
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    let contextData: ReturnType<typeof provideSession> | undefined

    const Provider = defineComponent({
      setup() {
        contextData = provideSession({ session: mockSession })
      },
      render() {
        return h(TestConsumer)
      },
    })

    mount(Provider)

    // Initially provided session, no fetch
    expect(mockToSession).not.toHaveBeenCalled()

    // Trigger refetch
    await contextData?.refetch()
    await flushPromises()

    expect(mockToSession).toHaveBeenCalledTimes(1)
  })

  it("uses custom baseUrl when provided", async () => {
    const customBaseUrl = "https://custom.ory.sh"
    const mockToSession = vi.fn().mockResolvedValue(mockSession)
    vi.mocked(frontendClient).mockReturnValue({
      toSession: mockToSession,
    } as ReturnType<typeof frontendClient>)

    const Provider = createProvider({ baseUrl: customBaseUrl })
    mount(Provider)

    await flushPromises()

    expect(frontendClient).toHaveBeenCalledWith(customBaseUrl)
  })

  it("handles null session as not authenticated", () => {
    const Provider = createProvider({ session: null })
    const wrapper = mount(Provider)

    expect(wrapper.find("[data-testid='no-session']").exists()).toBe(true)
    expect(wrapper.text()).toContain("No session")
  })
})
