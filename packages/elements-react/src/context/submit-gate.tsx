// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

/**
 * The outcome of a submit gate. `values` maps form field paths to values that
 * are added to the submitted data.
 *
 * @internal
 */
export type OrySubmitGateResult =
  | { proceed: false }
  | { proceed: true; values?: Record<string, string> }

/**
 * Runs after the user submits and before the flow is sent to Ory.
 *
 * Return a result synchronously when the decision is known right away. A
 * synchronous `{ proceed: false }` means the submit never starts.
 *
 * @internal
 */
export type OrySubmitGate = () =>
  | OrySubmitGateResult
  | Promise<OrySubmitGateResult>

const SubmitGateContext = createContext<Set<OrySubmitGate> | null>(null)

type NativeSubmitBlock = {
  blockers: number
  setBlockers: (update: (blockers: number) => number) => void
}

const NativeSubmitBlockContext = createContext<NativeSubmitBlock | null>(null)

export function OrySubmitGateProvider({ children }: PropsWithChildren) {
  const gates = useRef(new Set<OrySubmitGate>())
  const [blockers, setBlockers] = useState(0)
  const nativeSubmitBlock = useMemo(
    () => ({ blockers, setBlockers }),
    [blockers],
  )
  return (
    <SubmitGateContext.Provider value={gates.current}>
      <NativeSubmitBlockContext.Provider value={nativeSubmitBlock}>
        {children}
      </NativeSubmitBlockContext.Provider>
    </SubmitGateContext.Provider>
  )
}

/**
 * Registers a gate that every submit of the surrounding flow waits for.
 *
 * @param gate - The gate. The latest instance is used on each submit.
 * @internal
 */
export function useOrySubmitGate(gate: OrySubmitGate) {
  const gates = useContext(SubmitGateContext)
  const latest = useRef(gate)
  latest.current = gate

  useEffect(() => {
    if (!gates) {
      return
    }
    const registered: OrySubmitGate = () => latest.current()
    gates.add(registered)
    return () => {
      gates.delete(registered)
    }
  }, [gates])
}

/**
 * Blocks controls that submit the form natively, such as WebAuthn and passkey
 * triggers, while `blocked` is true. Native submits bypass submit gates.
 *
 * @param blocked - Whether a native submit would currently fail.
 * @internal
 */
export function useOryBlockNativeSubmit(blocked: boolean) {
  const setBlockers = useContext(NativeSubmitBlockContext)?.setBlockers

  useEffect(() => {
    if (!blocked || !setBlockers) {
      return
    }
    setBlockers((blockers) => blockers + 1)
    return () => setBlockers((blockers) => blockers - 1)
  }, [blocked, setBlockers])
}

/**
 * Returns whether controls that submit the form natively must stay disabled.
 *
 * @internal
 */
export function useIsOryNativeSubmitBlocked() {
  return (useContext(NativeSubmitBlockContext)?.blockers ?? 0) > 0
}

function isSettled(
  result: OrySubmitGateResult | Promise<OrySubmitGateResult>,
): result is OrySubmitGateResult {
  return !(result instanceof Promise)
}

function combine(results: OrySubmitGateResult[]): OrySubmitGateResult {
  let values: Record<string, string> = {}
  for (const result of results) {
    if (!result.proceed) {
      return result
    }
    values = { ...values, ...result.values }
  }
  return { proceed: true, values }
}

/**
 * Returns a function that runs all registered gates. The result is a promise
 * only when a gate has to wait and no gate cancelled right away.
 */
export function useRunSubmitGates() {
  const gates = useContext(SubmitGateContext)

  return useCallback((): OrySubmitGateResult | Promise<OrySubmitGateResult> => {
    const results = Array.from(gates ?? [], (gate) => gate())
    if (results.every(isSettled)) {
      return combine(results)
    }
    if (results.some((result) => isSettled(result) && !result.proceed)) {
      return { proceed: false }
    }
    return Promise.all(results).then(combine)
  }, [gates])
}
