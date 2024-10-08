import { LogoutFlow, Session } from "@ory/client-fetch"
import { useComponents } from "../../context"

export type OryPageHeaderProps = {
  session: Session
  logoutFlow: LogoutFlow
}

export const HeadlessPageHeader = () => {
  const { Page } = useComponents()

  return <Page.Header />
}
