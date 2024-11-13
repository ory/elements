// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// useSession.test.tsx

import { Session } from "@ory/client-fetch"
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/jest-globals"
import { act, render, screen, waitFor } from "@testing-library/react"
import { sessionStore, useSession } from "./useSession"
import {newOryFrontendClient} from "../utils/sdk";

jest.mock("./newOryFrontendClient", () => ({
  newOrynewOryFrontendClient: jest.fn(() => ({
    toSession: jest.fn(),
  })),
}))

// Create a test component to use the hook
const TestComponent = () => {
  const { session, isLoading, error } = useSession()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (session) return <div>Session: {session.id}</div>

  return <div>No session</div>
}

describe("useSession", () => {
  const mockSession: Session = {
    id: "test-session-id",
    identity: {
      id: "test-identity-id",
      traits: {},
      schema_id: "",
      schema_url: "",
    },
    expires_at: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    sessionStore.setState({
      isLoading: false,
      session: undefined,
      error: undefined,
    })
  })

  it("fetches and sets session successfully", async () => {
    ;(newOryFrontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockResolvedValue(mockSession),
    })

    render(<TestComponent />)

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Wait for the hook to update
    await waitFor(() =>
      expect(
        screen.getByText(`Session: ${mockSession.id}`),
      ).toBeInTheDocument(),
    )

    // Verify that the session data is displayed
    expect(screen.getByText(`Session: ${mockSession.id}`)).toBeInTheDocument()
  })

  it("doesn't refetch session if a session is set", async () => {
    ;(newOryFrontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockResolvedValue(mockSession),
    })

    render(<TestComponent />)

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Wait for the hook to update
    await waitFor(() =>
      expect(
        screen.getByText(`Session: ${mockSession.id}`),
      ).toBeInTheDocument(),
    )

    // Verify that the session data is displayed
    expect(screen.getByText(`Session: ${mockSession.id}`)).toBeInTheDocument()

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(newOryFrontendClient("").toSession).toHaveBeenCalledTimes(1)

    act(() => {
      render(<TestComponent />)
    })

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(newOryFrontendClient("").toSession).toHaveBeenCalledTimes(1)
  })

  it("handles errors during session fetching", async () => {
    const errorMessage = "Failed to fetch session"
    ;(newOryFrontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockRejectedValue(new Error(errorMessage)),
    })

    render(<TestComponent />)

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Wait for the hook to update after the error
    await waitFor(() =>
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument(),
    )

    // Verify that the error message is displayed
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it("does not fetch session if already loading or session is set", async () => {
    ;(newOryFrontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn(),
    })

    // First render: no session, simulate loading
    render(<TestComponent />)

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Simulate session already being set in the store
    await waitFor(() =>
      expect(screen.getByText("No session")).toBeInTheDocument(),
    )

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(newOryFrontendClient("").toSession).toHaveBeenCalledTimes(1)
  })
})
