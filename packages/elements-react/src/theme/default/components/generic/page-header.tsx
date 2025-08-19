// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryPageHeaderProps,
  useComponents,
  useOryConfiguration,
  useOryFlow,
} from "@ory/elements-react"
import { UserMenu } from "../ui/user-menu"
import { useSession } from "@ory/elements-react/client"
import { useIntl } from "react-intl"
import ArrowLeft from "../../assets/icons/arrow-left.svg"

export const DefaultPageHeader = (_props: OryPageHeaderProps) => {
  const { Card } = useComponents()
  const { session } = useSession()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const config = useOryConfiguration()

  const returnUrl = flow.return_to ?? config.project.default_redirect_url

  return (
    <div className="mt-16 flex w-full max-w-(--breakpoint-sm) flex-col gap-3 px-4 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]">
      <div className="flex flex-col gap-12">
        <div className="flex max-h-10 flex-1 items-center justify-between gap-2">
          <div className="h-9">
            <Card.Logo />
          </div>
          <UserMenu session={session} />
        </div>

        {returnUrl && (
          <div>
            <a
              data-testid={"ory/screen/settings/back-button"}
              href={returnUrl}
              className="inline-flex items-center gap-2 text-button-link-default-primary hover:text-button-link-default-primary-hover"
            >
              <ArrowLeft />{" "}
              {intl.formatMessage({
                id: "settings.navigation-back-button",
                defaultMessage: "Back",
              })}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
