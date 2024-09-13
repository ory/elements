import { useComponents } from "../../context"

export type OryCardHeaderProps = Record<string, never>

export function OryCardHeader() {
  const { CardHeader } = useComponents()
  return <CardHeader />
}
