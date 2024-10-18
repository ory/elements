// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ComponentPropsWithoutRef, forwardRef } from "react"
import { UserInitials } from "../../utils/user"
import IconUser from "../../assets/icons/user.svg"

type UserAvatarProps = {
  initials: UserInitials
} & ComponentPropsWithoutRef<"button">

export const UserAvatar = forwardRef<HTMLButtonElement, UserAvatarProps>(
  ({ initials, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className="size-10 relative flex overflow-hidden items-center justify-center rounded-full bg-button-primary-bg-default disabled:hover:bg-button-primary-bg-default hover:bg-button-primary-bg-hover"
        {...rest}
      >
        <div className="relative size-full flex items-center justify-center">
          {initials.avatar ? (
            <img
              src={initials.avatar}
              alt={initials.primary}
              className="w-full object-contain"
            />
          ) : (
            <IconUser size={24} className="text-button-primary-fg-default" />
          )}
        </div>
      </button>
    )
  },
)
UserAvatar.displayName = "UserAvatar"
