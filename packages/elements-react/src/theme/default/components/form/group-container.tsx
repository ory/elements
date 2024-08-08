import { HeadlessGroupContainerProps } from "../../../../components"

export function DefaultGroupContainer({
  children,
}: HeadlessGroupContainerProps) {
  return <div className="grid grid-cols-1 gap-6">{children}</div>
}
