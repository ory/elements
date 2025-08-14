// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render, screen } from "@testing-library/react"
import { DefaultCardFooter } from "./footer"
import {
  AuthenticatorAssuranceLevel,
  FlowType,
  LoginFlow,
  LogoutFlow,
  UiContainer,
  UiNodeGroupEnum,
} from "@ory/client-fetch"
import * as oryFlow from "@ory/elements-react"
import * as logout from "../../utils/logout"
import { IntlProvider } from "react-intl"
import * as uiUtils from "../../../../util/ui"
import enMessages from "../../../../locales/en.json"
import React from "react"
import {
  FlowContextValue,
  FormState,
  FormStateMethodActive,
  FormStateProvideIdentifier,
} from "@ory/elements-react"
import { defaultConfiguration } from "../../../../tests/jest/test-utils"

// Define interfaces for our mock options and returns
interface MockOptions {
  flowType?:
    | FlowType.Login
    | FlowType.Registration
    | FlowType.Recovery
    | FlowType.Verification
    | FlowType.Settings
    | FlowType.OAuth2Consent
  refresh?: boolean
  requestedAal?: AuthenticatorAssuranceLevel | undefined
  formState?: FormState
  registrationEnabled?: boolean
  authMethods?: string[]
  returnTo?: string
  hasLogout?: boolean
  didLoadLogout?: boolean
}

// Mock the necessary hooks
jest.mock("@ory/elements-react", (): unknown => ({
  ...jest.requireActual("@ory/elements-react"),
  useOryFlow: jest.fn(),
  useOryConfiguration: jest.fn(),
  useComponents: jest.fn(
    (): {
      Node: {
        Button: React.FC<{ attributes: { value: string }; node: unknown }>
        Checkbox: React.FC<{ attributes: unknown; node: unknown }>
      }
    } => ({
      Node: {
        Button: ({ attributes }) => <button>{attributes.value}</button>,
        Checkbox: () => <input type="checkbox" />,
      },
    }),
  ),
}))

jest.mock("../../utils/logout", () => ({
  useClientLogout: jest.fn(),
}))

jest.mock("../../../../util/ui", () => ({
  nodesToAuthMethodGroups: jest.fn(),
  useNodeGroupsWithVisibleNodes: jest.fn((): UiNodeGroupEnum[] => []),
}))

describe("DefaultCardFooter", () => {
  describe("LoginCardFooter", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const setupMocks = (options: MockOptions = {}) => {
      const {
        flowType = FlowType.Login,
        refresh = false,
        requestedAal = undefined,
        formState = {
          current: "provide_identifier",
        } as FormStateProvideIdentifier,
        registrationEnabled = true,
        authMethods = [],
        returnTo = "https://example.com",
        hasLogout = false,
        didLoadLogout = false,
      } = options

      jest.spyOn(oryFlow, "useOryConfiguration").mockReturnValue({
        project: {
          ...defaultConfiguration.project,
          registration_enabled: registrationEnabled,
        },
        sdk: {
          url: "https://example.com",
          frontend: {} as any,
        },
      })

      jest.spyOn(oryFlow, "useOryFlow").mockReturnValue({
        flowType,
        flow: {
          ui: {
            nodes: [],
            action: "https://example.com/action",
            method: "POST",
          } as UiContainer,
          refresh,
          requested_aal: requestedAal,
          return_to: returnTo,
        } as LoginFlow,
        formState: formState,
      } as FlowContextValue)

      jest.spyOn(logout, "useClientLogout").mockReturnValue({
        logoutFlow: hasLogout
          ? ({ logout_url: "https://logout.com" } as LogoutFlow)
          : undefined,
        didLoad: didLoadLogout,
      })

      // Mock nodesToAuthMethodGroups with proper typing
      jest
        .spyOn(uiUtils, "nodesToAuthMethodGroups")
        .mockReturnValue(authMethods as UiNodeGroupEnum[])
    }

    const renderWithIntl = (ui: React.ReactNode) => {
      return render(
        <IntlProvider locale="en" messages={enMessages}>
          {ui}
        </IntlProvider>,
      )
    }

    it("renders null if flow type is not login", () => {
      setupMocks({ flowType: FlowType.Registration })
      renderWithIntl(<DefaultCardFooter />)
      expect(screen.queryByText(/Sign up/i)).not.toBeInTheDocument()
    })

    it("renders registration link when in provide_identifier state", () => {
      setupMocks({
        registrationEnabled: true,
      })
      renderWithIntl(<DefaultCardFooter />)
      expect(
        screen.getByTestId("ory/screen/login/action/register"),
      ).toBeInTheDocument()
    })

    it("does not render registration link when registration is disabled", () => {
      setupMocks({
        registrationEnabled: false,
      })
      renderWithIntl(<DefaultCardFooter />)
      expect(
        screen.queryByTestId("ory/screen/login/action/register"),
      ).not.toBeInTheDocument()
    })

    it("renders logout link when flow.refresh is true", () => {
      setupMocks({ refresh: true, hasLogout: true, didLoadLogout: true })
      renderWithIntl(<DefaultCardFooter />)
      expect(
        screen.getByTestId("ory/screen/login/action/logout"),
      ).toBeInTheDocument()
    })

    it("renders logout link when requested_aal is aal2", () => {
      setupMocks({
        requestedAal: AuthenticatorAssuranceLevel.Aal2,
        hasLogout: true,
        didLoadLogout: true,
        authMethods: ["totp", "code"],
        formState: {
          current: "select_method",
        },
      })
      renderWithIntl(<DefaultCardFooter />)
      expect(
        screen.getByTestId("ory/screen/login/action/logout"),
      ).toBeInTheDocument()
    })

    it("renders method selection link when multiple auth methods exist", () => {
      setupMocks({
        formState: { current: "method_active" } as FormStateMethodActive,
        authMethods: ["password", "totp"],
      })
      renderWithIntl(<DefaultCardFooter />)
      expect(
        screen.getByTestId("ory/screen/login/mfa/action/selectMethod"),
      ).toBeInTheDocument()
    })

    it("renders cancel link for code auth method", () => {
      setupMocks({
        formState: {
          current: "method_active",
          method: "code",
        } as FormStateMethodActive,
        authMethods: ["code"],
      })
      renderWithIntl(<DefaultCardFooter />)
      // Updated to match the actual data-testid
      expect(
        screen.getByTestId("ory/screen/login/action/cancel"),
      ).toBeInTheDocument()
    })
  })
})
