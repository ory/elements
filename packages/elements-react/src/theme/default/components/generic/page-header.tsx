// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryPageHeaderProps,
  useComponents,
  useOryFlow,
} from "@ory/elements-react"
import { UserMenu } from "../ui/user-menu"
import { useSession } from "@ory/elements-react/client"
import { useIntl } from "react-intl"

export const DefaultPageHeader = (_props: OryPageHeaderProps) => {
  const { Card } = useComponents()
  const { session } = useSession()
  const intl = useIntl()
  const { config } = useOryFlow()

  return (
    <div className="mt-16 flex max-w-screen-sm w-full md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px] flex-col gap-3 px-4">
      <div className="flex flex-col gap-12">
        <div className="flex max-h-10 flex-1 justify-between gap-2">
          <div className="relative h-10 flex-1">
            <Card.Logo />
            {config.project.default_redirect_url && (
              <div className="mt-2">
                <a href={config.project.default_redirect_url}>
                  &#x2190;{" "}
                  {intl.formatMessage({
                    id: "settings.navigation-back-button",
                    defaultMessage: "Back",
                  })}
                </a>
              </div>
            )}
          </div>
          <UserMenu session={session} />
        </div>
      </div>
    </div>
  )
}
