import { toast as sonnerToast } from "sonner"
import { OryToastProps } from "@ory/elements-react"
import { ComponentType } from "react"
import { UiText } from "@ory/client-fetch"

export function toast(
  title: string,
  message: UiText,
  Cmp: { Toast: ComponentType<OryToastProps> },
) {
  return sonnerToast.custom((id) => <Cmp.Toast id={id} message={message} />, {
    duration: Infinity,
  })
}
