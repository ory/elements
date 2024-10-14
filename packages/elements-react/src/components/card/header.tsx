import { useComponents } from "../../context"

export type OryCardHeaderProps = Record<string, never>

export function OryCardHeader() {
  const { Card } = useComponents()
  return <Card.Header />
}
