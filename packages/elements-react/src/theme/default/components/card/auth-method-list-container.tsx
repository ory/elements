import { PropsWithChildren } from "react"

export function DefaultAuthMethodListContainer({
  children,
}: PropsWithChildren) {
  return <div className="grid grid-cols-1 gap-2">{children}</div>
}
