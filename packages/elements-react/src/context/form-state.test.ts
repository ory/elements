// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNodeGroupEnum } from "@ory/client-fetch"
import { act, renderHook } from "@testing-library/react"
import { OryFlowContainer } from "../util"
import { useFormStateReducer } from "./form-state" // Adjust path as needed

const init = {
  flowType: FlowType.Login,
  flow: { ui: { nodes: [] } },
} as unknown as OryFlowContainer
test('should initialize with "provide_identifier" state', () => {
  const { result } = renderHook(() => useFormStateReducer(init))

  const [state] = result.current
  expect(state).toEqual({ current: "provide_identifier" })
})

test('should initialize with "settings" state for settings flows', () => {
  const { result } = renderHook(() =>
    useFormStateReducer({
      flowType: FlowType.Settings,
    } as unknown as OryFlowContainer),
  )

  const [state] = result.current
  expect(state).toEqual({ current: "settings" })
})

test('should transition to "method_active" state when "action_select_method" is dispatched', () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  act(() => {
    dispatch({
      type: "action_select_method",
      method: UiNodeGroupEnum.Code,
    })
  })

  const [state] = result.current
  expect(state).toEqual({
    current: "method_active",
    method: UiNodeGroupEnum.Code,
  })
})

const activeMethods = ["link_recovery", "code_recovery", "code"]

activeMethods.forEach((activeMethod) => {
  test(`should parse state from flow on "action_flow_update" with active method = ${activeMethod}`, () => {
    const { result } = renderHook(() => useFormStateReducer(init))
    const [, dispatch] = result.current

    const mockFlow = {
      flowType: FlowType.Login,
      flow: {
        active: activeMethod,
        ui: { nodes: [] }, // Assuming nodes structure
      },
    } as unknown as OryFlowContainer

    act(() => {
      dispatch({
        type: "action_flow_update",
        flow: mockFlow,
      })
    })

    const [state] = result.current
    expect(state).toMatchSnapshot()
  })
})

test(`should parse state from flow on "action_flow_update" provide_identifier`, () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  const mockFlow = {
    flowType: FlowType.Login,
    flow: {
      active: "",
      ui: { nodes: [] }, // Assuming nodes structure
    },
  } as unknown as OryFlowContainer

  act(() => {
    dispatch({
      type: "action_flow_update",
      flow: mockFlow,
    })
  })

  const [state] = result.current
  expect(state).toEqual({ current: "provide_identifier" })
})

test(`should parse state from flow on "action_flow_update" when choosing method on registration`, () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  const mockFlow = {
    flowType: FlowType.Registration,
    flow: {
      active: "",
      ui: {
        nodes: [
          {
            attributes: {
              name: "screen",
              value: "previous",
            },
          },
        ],
      }, // Assuming nodes structure
    },
  } as unknown as OryFlowContainer

  act(() => {
    dispatch({
      type: "action_flow_update",
      flow: mockFlow,
    })
  })

  const [state] = result.current
  expect(state).toEqual({ current: "select_method" })
})

test(`should parse state from flow on "action_flow_update" when choosing method on login`, () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  const mockFlow = {
    flowType: FlowType.Login,
    flow: {
      active: "",
      ui: {
        nodes: [
          {
            group: "identifier_first",
            attributes: {
              name: "identifier",
              type: "hidden",
            },
          },
        ],
      }, // Assuming nodes structure
    },
  } as unknown as OryFlowContainer

  act(() => {
    dispatch({
      type: "action_flow_update",
      flow: mockFlow,
    })
  })

  const [state] = result.current
  expect(state).toEqual({ current: "select_method" })
})
;[(FlowType.Recovery, FlowType.Verification)].forEach((flowType) => {
  test(`should parse state from flow on "action_flow_update" ${flowType} provide_identifier`, () => {
    const { result } = renderHook(() => useFormStateReducer(init))
    const [, dispatch] = result.current

    const mockFlow = {
      flowType: FlowType.Recovery,
      flow: {
        state: "choose_method",
        active: "code",
        ui: { nodes: [] }, // Assuming nodes structure
      },
    } as unknown as OryFlowContainer

    act(() => {
      dispatch({
        type: "action_flow_update",
        flow: mockFlow,
      })
    })

    const [state] = result.current
    expect(state).toEqual({ current: "provide_identifier" })
  })

  test(`should parse state from flow on "action_flow_update" ${flowType} flow active`, () => {
    const { result } = renderHook(() => useFormStateReducer(init))
    const [, dispatch] = result.current

    const mockFlow = {
      flowType: FlowType.Recovery,
      flow: {
        state: "sent_email",
        active: "code",
        ui: { nodes: [] }, // Assuming nodes structure
      },
    } as unknown as OryFlowContainer

    act(() => {
      dispatch({
        type: "action_flow_update",
        flow: mockFlow,
      })
    })

    const [state] = result.current
    expect(state).toEqual({ current: "method_active", method: "code" })
  })
})

test('should fallback to "impossible_unknown" for unknown recovery state', () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  const mockFlow = {
    flowType: FlowType.Recovery, // Intentional to simulate an unexpected flow
    flow: { id: "unknown", active: null, ui: { nodes: [] } },
  } as unknown as OryFlowContainer

  expect(() =>
    act(() => {
      dispatch({
        type: "action_flow_update",
        flow: mockFlow,
      })
    }),
  ).toThrow("Unknown form state")
})

test('should fallback to "impossible_unknown" for unrecognized flow', () => {
  const { result } = renderHook(() => useFormStateReducer(init))
  const [, dispatch] = result.current

  const mockFlow = {
    flowType: "unknown" as FlowType, // Intentional to simulate an unexpected flow
    flow: { id: "unknown", active: null, ui: { nodes: [] } },
  } as unknown as OryFlowContainer

  expect(() =>
    act(() => {
      dispatch({
        type: "action_flow_update",
        flow: mockFlow,
      })
    }),
  ).toThrow("Unknown form state")
})