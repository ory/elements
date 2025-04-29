// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow, Session } from "@ory/client-fetch"
import { useOryFlow } from "@ory/elements-react"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import IconLogout from "../../assets/icons/logout.svg"
import IconSettings from "../../assets/icons/settings.svg"
import { useClientLogout } from "../../utils/logout"
import { getUserInitials } from "../../utils/user"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { UserAvatar } from "./user-avater"

type UserMenuProps = {
  session: Session | null
  logoutFlow?: LogoutFlow
}

export const UserMenu = ({ session }: UserMenuProps) => {
  const { config } = useOryFlow()
  const initials = getUserInitials(session)
  const { logoutFlow } = useClientLogout(config)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar initials={initials} title="User Menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex gap-3 px-5 py-4.5">
          <UserAvatar disabled initials={initials} />
          <div className="flex flex-col justify-center text-sm leading-tight">
            <div className="text-interface-foreground-default-primary leading-tight font-medium">
              {initials.primary}
            </div>
            {initials.secondary && (
              <div className="text-interface-foreground-default-tertiary leading-tight">
                {initials.secondary}
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href="/settings">
            <IconSettings size={16} /> User settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={!logoutFlow?.logout_url}>
          <a href={logoutFlow?.logout_url}>
            <IconLogout size={16} /> Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
