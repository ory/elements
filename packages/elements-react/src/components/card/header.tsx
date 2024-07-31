import { useComponents } from "../../context/component"

export type OryCardHeaderProps = {}

export function OryCardHeader() {
  const { CardHeader } = useComponents()
  return <CardHeader />
}
