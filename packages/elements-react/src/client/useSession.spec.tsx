// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// useSession.test.tsx

import { Session } from "@ory/client-fetch"
import { act, render, screen, waitFor } from "@testing-library/react"
import { useSession } from "./useSession"
import { frontendClient } from "./frontendClient"
import { SessionProvider } from "./session-provider"
import { PropsWithChildren } from "react"

jest.mock("./frontendClient", () => ({
  frontendClient: jest.fn(() => ({
    toSession: jest.fn(),
  })),
}))

// Create a test component to use the hook
const TestComponent = () => {
  const { isLoading, session, error } = useSession()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (session) return <div>Session: {session.id}</div>

  return <div>No session</div>
}

const TestSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>
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
    active: true,
    expires_at: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("fetches and sets session successfully", async () => {
    ;(frontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockResolvedValue(mockSession),
    })

    const container = render(<TestComponent />, {
      wrapper: TestSessionProvider,
    })

    // Initially, it should show loading
    await waitFor(() =>
      expect(screen.getByText("Loading...")).toBeInTheDocument(),
    )

    act(() => container.rerender(<TestComponent />))
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
    ;(frontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockResolvedValue(mockSession),
    })

    render(<TestComponent />, {
      wrapper: TestSessionProvider,
    })

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // act(() => container.rerender(<TestComponent />))
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
    expect(frontendClient().toSession).toHaveBeenCalledTimes(1)

    act(() => {
      render(<TestComponent />)
    })

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(frontendClient().toSession).toHaveBeenCalledTimes(1)
  })

  it("handles errors during session fetching", async () => {
    const errorMessage = "Failed to fetch session"
    ;(frontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockRejectedValue(new Error(errorMessage)),
    })

    render(<TestComponent />, { wrapper: TestSessionProvider })

    // Initially, it should show loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Wait for the hook to update after the error
    await waitFor(() =>
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument(),
    )

    // Verify that the error message is displayed
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
  })

  it("does not fetch session if session is provided to provider", () => {
    ;(frontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn(),
    })

    // First render: no session, simulate loading
    render(<TestComponent />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <SessionProvider session={{ ...mockSession, id: "provided-session" }}>
          {children}
        </SessionProvider>
      ),
    })

    // Initially, it should show loading
    expect(screen.getByText("Session: provided-session")).toBeInTheDocument()

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(frontendClient().toSession).toHaveBeenCalledTimes(0)
  })

  it("fetches session automatically if not provided", async () => {
    ;(frontendClient as jest.Mock).mockReturnValue({
      toSession: jest.fn().mockResolvedValue(mockSession),
    })

    // First render: no session, simulate loading
    render(<TestComponent />, {
      wrapper: ({ children }: PropsWithChildren) => (
        <SessionProvider>{children}</SessionProvider>
      ),
    })

    await waitFor(() =>
      expect(screen.getByText("Session: test-session-id")).toBeInTheDocument(),
    )

    // this is fine, because jest is not calling the function
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(frontendClient().toSession).toHaveBeenCalledTimes(1)
  })
})
