import { UiNode } from "@ory/client-fetch"
import { useOryFlow } from "../../context"
import { useOryFormSubmit } from "./useOryFormSubmit"
import { computeDefaultValues } from "./form-helpers"
import { FormValues } from "../../types"
import { useCallback, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      "name" in n.attributes &&
      ((["email", "recovery_confirm_address"].includes(n.attributes.name) &&
        n.attributes.type === "submit") ||
        n.attributes.name === "resend"),
  )
}

/**
 * useResendCode provides a callback to trigger a code resend in the current flow.
 *
 * You may use this hook to implement a "Resend Code" button in your forms.
 *
 * If the current flow does not support code resending, `resendCodeNode` will be `undefined` and `resendCode` will be a no-op.
 *
 * Example:
 * ```tsx
 * const { resendCode, resendCodeNode } = useResendCode();
 *
 * return (
 *  {resendCodeNode && (
 *    <button onClick={resendCode}>Resend Code</button>
 *  )}
 * )
 * ```
 *
 * @returns the callback to trigger a code resend
 * @group Hooks
 */
export function useResendCode() {
  const flowContainer = useOryFlow()
  const { watch } = useFormContext()
  const resendCodeNode = findResendNode(flowContainer.flow.ui.nodes)
  const formSubmit = useOryFormSubmit()
  const [turnstileResponse, setTurnstileResponse] = useState<
    string | undefined
  >()

  // This workaround ensures that CAPTCHA response token is also included when resending the code.
  const captchaVerificationValue = watch("transient_payload")
    ?.captcha_turnstile_response as string | undefined
  useEffect(() => {
    if (captchaVerificationValue) {
      setTurnstileResponse(captchaVerificationValue)
    }
  }, [captchaVerificationValue])

  const handleResend = useCallback(() => {
    const hiddenFields = flowContainer.flow.ui.nodes
      .filter(
        (n) =>
          n.attributes.node_type === "input" &&
          (n.attributes.type === "hidden" || n.group === "default"),
      )
      .map((n) => {
        if (
          n.attributes.node_type === "input" &&
          n.attributes.name ===
            "transient_payload.captcha_turnstile_response" &&
          turnstileResponse
        ) {
          n.attributes.value = turnstileResponse
        }
        return n
      })

    const hiddenData = computeDefaultValues({
      active: flowContainer.flow.active,
      ui: { nodes: hiddenFields },
    })

    if (resendCodeNode?.attributes && "name" in resendCodeNode.attributes) {
      const data: FormValues = {
        code: undefined,
        [resendCodeNode.attributes.name]: resendCodeNode.attributes.value,
        method: "code",
      }
      formSubmit({ ...hiddenData, ...data })
    }
  }, [
    flowContainer.flow.active,
    flowContainer.flow.ui.nodes,
    formSubmit,
    resendCodeNode?.attributes,
    turnstileResponse,
  ])

  return {
    resendCode: handleResend,
    resendCodeNode,
  }
}
