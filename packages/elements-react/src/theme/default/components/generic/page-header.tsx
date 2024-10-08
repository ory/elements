// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryPageHeaderProps, useComponents } from "@ory/elements-react"
import { ReturnButton } from "../ui/return-button"
import { UserMenu } from "../ui/user-menu"

export const DefaultPageHeader = ({
  logoutFlow,
  session,
}: OryPageHeaderProps) => {
  const { Card } = useComponents()
  // const logoutFlow = await serverClientFrontend().createBrowserLogoutFlow()

  return (
    <div className="flex max-w-[896px] flex-col w-full gap-3 mt-16">
      <div className="flex flex-col gap-12">
        <div className="flex gap-2 max-h-10 justify-between flex-1">
          <div className="h-10 flex-1 relative">
            <Card.Logo />
          </div>
          <UserMenu session={session} logoutFlow={logoutFlow} />
        </div>
        <ReturnButton />
      </div>
    </div>
  )
}
