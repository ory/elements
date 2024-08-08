import { useComponents } from "../../context/component"

export type OryCardHeaderProps = Record<string, never>

export function OryCardHeader() {
  const { CardHeader } = useComponents()
  return <CardHeader />
}
