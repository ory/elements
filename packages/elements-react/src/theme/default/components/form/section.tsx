// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from "@ory/elements-react"
import { cn } from "../../utils/cn"

const DefaultFormSection = ({
  children,
  nodes: _nodes,
  ...rest
}: OryFormSectionProps) => {
  return (
    <form
      className="flex w-full max-w-(--breakpoint-sm) flex-col px-4 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]"
      {...rest}
    >
      {children}
    </form>
  )
}

const DefaultFormSectionContent = ({
  title,
  description,
  children,
}: OryFormSectionContentProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-t-cards border border-b-0 border-interface-border-default-primary bg-interface-background-default-primary px-6 py-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-interface-foreground-default-primary">
          {title}
        </h3>
        <span className="text-interface-foreground-default-secondary">
          {description}
        </span>
      </div>
      {children}
    </div>
  )
}

const DefaultFormSectionFooter = ({
  children,
  text,
}: OryFormSectionFooterProps) => {
  return (
    <div
      className={cn(
        "flex min-h-[72px] items-center justify-between gap-2 rounded-b-cards border border-interface-border-default-primary bg-interface-background-default-secondary px-6 py-4 text-interface-foreground-default-tertiary",
      )}
    >
      <span>{text}</span>
      {children}
    </div>
  )
}

export {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
}
