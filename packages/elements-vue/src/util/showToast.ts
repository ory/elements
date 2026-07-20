// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { UiText } from "@ory/client-fetch"
import type { Component } from "vue"
import { toast as sonnerToast } from "vue-sonner"
import { h, markRaw } from "vue"

export interface OryToastProps {
  message: UiText
  id?: string | number
  onDismiss?: () => void
}

let toastCounter = 0

export function showToast(
  toastProps: Omit<OryToastProps, "id" | "onDismiss">,
  ToastComponent: Component,
) {
  const toastId = `ory-toast-${++toastCounter}`
  const rawComponent = markRaw(ToastComponent)

  return sonnerToast.custom(
    () =>
      h(rawComponent, {
        id: toastId,
        message: toastProps.message,
        onDismiss: () => sonnerToast.dismiss(toastId),
      }),
    { id: toastId },
  )
}
