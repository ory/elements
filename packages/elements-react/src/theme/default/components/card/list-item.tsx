// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from "react"
import { SVGIcon } from "../../assets/types"
import { cn } from "../../utils/cn"

type ListItemProps<T extends React.ElementType = "div"> = {
  icon: SVGIcon
  as?: T
  title: string
  description: string
  right?: React.ReactNode
}

export function ListItem<T extends React.ElementType = "div">({
  icon: Icon,
  as,
  title,
  description,
  children,
  className,
  ...props
}: PropsWithChildren<ListItemProps<T>> & React.ComponentPropsWithoutRef<T>) {
  const Comp = as || "div"

  return (
    <Comp
      {...props}
      className={cn(
        "flex cursor-pointer gap-3 text-left items-start w-full rounded-buttons p-2 hover:bg-interface-background-default-primary-hover",
        className as string,
      )}
    >
      <span className="mt-1">
        {Icon && (
          <Icon size={16} className="text-interface-foreground-brand-primary" />
        )}
      </span>
      <span className="flex-1 leading-normal inline-flex flex-col max-w-full min-w-1">
        <span className="text-interface-foreground-default-primary break-words">
          {title}
        </span>
        <span className="text-interface-foreground-default-secondary">
          {description}
        </span>
      </span>
      {children}
    </Comp>
  )
}
