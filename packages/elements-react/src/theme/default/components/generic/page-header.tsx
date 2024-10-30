// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryPageHeaderProps, useComponents } from "@ory/elements-react"
import { UserMenu } from "../ui/user-menu"
import { useSession } from "@ory/elements-react/client"

export const DefaultPageHeader = (_props: OryPageHeaderProps) => {
  const { Card } = useComponents()
  const { session } = useSession()

  return (
    <div className="flex max-w-[896px] flex-col w-full gap-3 mt-16">
      <div className="flex flex-col gap-12">
        <div className="flex gap-2 max-h-10 justify-between flex-1">
          <div className="h-10 flex-1 relative">
            <Card.Logo />
          </div>
          <UserMenu session={session} />
        </div>
      </div>
    </div>
  )
}
