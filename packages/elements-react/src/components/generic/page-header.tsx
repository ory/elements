import { LogoutFlow } from "@ory/client-fetch"
import { useComponents } from "../../context"

export type OryPageHeaderProps = {
  logoutFlow: LogoutFlow
}

export const HeadlessPageHeader = () => {
  const { Page } = useComponents()

  return <Page.Header />
}
