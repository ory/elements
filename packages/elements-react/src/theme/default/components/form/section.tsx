// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from "@ory/elements-react"
import { cn } from "../../utils/cn"
import { isValidElement } from "react"

const DefaultFormSection = ({ children }: OryFormSectionProps) => {
  return (
    <div className="flex w-80 flex-col md:w-[712px] lg:w-[802px] xl:w-[896px]">
      {children}
    </div>
  )
}

const DefaultFormSectionContent = ({
  title,
  description,
  children,
}: OryFormSectionContentProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-t-xl border border-b-0 border-interface-border-default-primary bg-interface-background-default-primary px-6 py-8">
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
        "flex min-h-[72px] items-center justify-end gap-2 rounded-b-xl border border-interface-border-default-primary bg-interface-background-default-secondary px-6 py-4 text-interface-foreground-default-tertiary",
        isValidElement(children) && text && "justify-between",
        text && "justify-start",
      )}
    >
      {text}
      {children}
    </div>
  )
}

export {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
}
