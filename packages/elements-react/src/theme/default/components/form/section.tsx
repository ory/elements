// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from "@ory/elements-react"

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
    <div className="flex flex-col gap-8 rounded-t-xl border border-b-0 border-dialog-border-default bg-forms-bg-default px-6 py-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-dialog-fg-default">{title}</h3>
        <span className="text-sm text-dialog-fg-subtle">{description}</span>
      </div>
      {children}
    </div>
  )
}

const DefaultFormSectionFooter = ({ children }: OryFormSectionFooterProps) => {
  return (
    <div className="flex min-h-[72px] items-center justify-end gap-2 rounded-b-xl border border-dialog-border-default bg-dialog-bg-subtle px-6 py-4 text-sm text-dialog-fg-mute [&>span]:mr-auto">
      {children}
    </div>
  )
}

export {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
}
