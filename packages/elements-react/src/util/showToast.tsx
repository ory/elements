import { toast as sonnerToast } from "sonner"
import { OryToastProps } from "../components"

export function showToast(
  toast: Omit<OryToastProps, "id">,
  ToastComponent: React.ComponentType<OryToastProps>,
) {
  return sonnerToast.custom((id) => (
    <ToastComponent id={id} message={toast.message} />
  ))
}
