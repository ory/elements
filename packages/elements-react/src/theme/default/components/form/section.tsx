// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from "@ory/elements-react"

const DefaultFormSection = ({ children }: OryFormSectionProps) => {
  return <div className="flex flex-col">{children}</div>
}

const DefaultFormSectionContent = ({
  title,
  description,
  children,
}: OryFormSectionContentProps) => {
  return (
    <div className="border rounded-t-xl border-b-0 border-dialog-border-default bg-forms-bg-default px-6 py-8 flex flex-col gap-8">
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
    <div className="rounded-b-xl gap-2 flex justify-end px-6 py-4 bg-dialog-bg-subtle border border-dialog-border-default text-sm text-dialog-fg-mute items-center [&>span]:mr-auto min-h-[72px]">
      {children}
    </div>
  )
}

export {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
}
