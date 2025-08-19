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
        "flex w-full cursor-pointer items-start gap-3 rounded-buttons p-2 text-left hover:bg-interface-background-default-primary-hover",
        "disabled:cursor-default disabled:opacity-50 disabled:hover:bg-ui-transparent",
        className as string,
      )}
    >
      <span className="mt-1">
        {Icon && (
          <Icon size={16} className="text-interface-foreground-brand-primary" />
        )}
      </span>
      <span className="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal">
        <span className="break-words text-interface-foreground-default-primary">
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
