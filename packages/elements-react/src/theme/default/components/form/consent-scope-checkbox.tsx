// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentScopeCheckboxProps } from "@ory/elements-react"
import * as Switch from "@radix-ui/react-switch"
import { defineMessages, useIntl } from "react-intl"
import IconMessage from "../../assets/icons/message.svg"
import IconPersonal from "../../assets/icons/personal.svg"
import Phone from "../../assets/icons/phone.svg"
import { ListItem } from "../card/list-item"

const ScopeIcons: Record<string, typeof IconPersonal> = {
  openid: IconPersonal,
  offline_access: IconPersonal,
  profile: IconPersonal,
  email: IconMessage,
  phone: Phone,
}

const titles = defineMessages<string>({
  openid: {
    id: "consent.scope.openid.title",
    defaultMessage: "Identity",
  },
  offline_access: {
    id: "consent.scope.offline_access.title",
    defaultMessage: "Offline Access",
  },
  profile: {
    id: "consent.scope.profile.title",
    defaultMessage: "Profile Information",
  },
  email: {
    id: "consent.scope.email.title",
    defaultMessage: "Email Address",
  },
  address: {
    id: "consent.scope.address.title",
    defaultMessage: "Physical Address",
  },
  phone: {
    id: "consent.scope.phone.title",
    defaultMessage: "Phone Number",
  },
})

const descriptions = defineMessages<string>({
  openid: {
    id: "consent.scope.openid.description",
    defaultMessage:
      "Allows the application to verify your identity. This is required for authentication and a trusted login experience.",
  },
  offline_access: {
    id: "consent.scope.offline_access.description",
    defaultMessage:
      "Allows this application to keep you signed in even when you're not actively using it.",
  },
  profile: {
    id: "consent.scope.profile.description",
    defaultMessage:
      "Allows access to your basic profile details, including your username, first name, and last name.",
  },
  email: {
    id: "consent.scope.email.description",
    defaultMessage: "Retrieve your email address and its verification status.",
  },
  address: {
    id: "consent.scope.address.description",
    defaultMessage: "Access your postal address.",
  },
  phone: {
    id: "consent.scope.phone.description",
    defaultMessage: "Retrieve your phone number and its verification status.",
  },
})

export function DefaultConsentScopeCheckbox({
  attributes,
  onCheckedChange,
  inputProps,
}: OryNodeConsentScopeCheckboxProps) {
  const intl = useIntl()
  const Icon = ScopeIcons[attributes.value as string] ?? IconPersonal

  const fallbackTitleMsg = {
    id: `consent.scope.${attributes.value}.title`,
    defaultMessage: attributes.value,
  }
  const fallbackDescriptionMsg = {
    id: `consent.scope.${attributes.value}.description`,
    defaultMessage: [],
  }
  return (
    <ListItem
      as="label"
      icon={Icon}
      title={intl.formatMessage(
        titles[attributes.value as string] ?? fallbackTitleMsg,
      )}
      description={intl.formatMessage(
        descriptions[attributes.value as string] ?? fallbackDescriptionMsg,
      )}
      className="col-span-2"
      data-testid="ory/screen/consent/scope-checkbox-label"
    >
      <Switch.Root
        className="relative h-4 w-7 rounded-identifier border border-toggle-border-default bg-toggle-background-default p-[3px] transition-all data-[state=checked]:border-toggle-border-checked data-[state=checked]:bg-toggle-background-checked"
        data-testid={`ory/screen/consent/scope-checkbox`}
        {...inputProps}
        onCheckedChange={onCheckedChange}
        defaultChecked={true}
      >
        <Switch.Thumb className="block size-2 rounded-identifier bg-toggle-foreground-default transition-all data-[state=checked]:translate-x-3 data-[state=checked]:bg-toggle-foreground-checked" />
      </Switch.Root>
    </ListItem>
  )
}
