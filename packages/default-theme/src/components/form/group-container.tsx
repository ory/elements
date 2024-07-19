import { HeadlessGroupContainerProps } from "@ory/react-headless/src/components/form/groups"

export function DefaultGroupContainer({
  children,
}: HeadlessGroupContainerProps) {
  return <div className="grid grid-cols-1 gap-6">{children}</div>
}
