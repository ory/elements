import { LogoutFlow, Session } from "@ory/client-fetch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./dropdown-menu"
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu"
import IconSettings from "../../assets/icons/settings.svg"
import IconLogout from "../../assets/icons/logout.svg"
import { UserAvatar } from "./user-avater"
import { getUserInitials } from "../../utils/user"

type UserMenuProps = {
  session?: Session
  logoutFlow: LogoutFlow
}

export const UserMenu = ({ session, logoutFlow }: UserMenuProps) => {
  const initials = getUserInitials(session)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar initials={initials} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="px-5 py-4.5 flex gap-3">
          <UserAvatar disabled initials={initials} />
          <div className="flex flex-col text-sm leading-tight">
            <div className="text-dialog-fg-default">{initials.primary}</div>
            <div className="text-dialog-fg-mute">{initials.secondary}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href="/settings">
            <IconSettings size={16} /> User settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={logoutFlow?.logout_url}>
            <IconLogout size={16} /> Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
