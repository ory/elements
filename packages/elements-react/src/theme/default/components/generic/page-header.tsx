// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryPageHeaderProps, useComponents } from "@ory/elements-react"
import { UserMenu } from "../ui/user-menu"
import { useSession } from "@ory/elements-react/client"

export const DefaultPageHeader = (_props: OryPageHeaderProps) => {
  const { Card } = useComponents()
  const { session } = useSession()

  return (
    <div className="mt-16 flex w-full max-w-[896px] flex-col gap-3">
      <div className="flex flex-col gap-12">
        <div className="flex max-h-10 flex-1 justify-between gap-2">
          <div className="relative h-10 flex-1">
            <Card.Logo />
          </div>
          <UserMenu session={session} />
        </div>
      </div>
    </div>
  )
}
