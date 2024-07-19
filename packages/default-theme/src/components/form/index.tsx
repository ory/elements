import { HeadlessFormProps, HeadlessMessageProps } from "@ory/react-headless"
import { PropsWithChildren } from "react"
import { cn } from "../../utils/cn"

export function DefaultFormContainer({
  children,
  onSubmit,
  action,
  method,
}: PropsWithChildren<HeadlessFormProps>) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      action={action}
      method={method}
      className={"grid gap-8"}
    >
      {children}
    </form>
  )
}

export function DefaultMessageContainer({ children }: PropsWithChildren<{}>) {
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null
  }

  return <div className="text-left">{children}</div>
}

export function DefaultMessage({ message }: HeadlessMessageProps) {
  return (
    <span
      className={cn("text-sm mt-1 leading-normal", {
        "text-forms-fg-error": message.type === "error",
        "text-forms-fg-default": message.type === "info",
        "text-forms-fg-success": message.type === "success",
      })}
    >
      {message.text}
    </span>
  )
}
