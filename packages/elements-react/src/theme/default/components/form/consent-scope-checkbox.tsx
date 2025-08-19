// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentScopeCheckboxProps } from "@ory/elements-react"
import IconPersonal from "../../assets/icons/personal.svg"
import IconMessage from "../../assets/icons/message.svg"
import Phone from "../../assets/icons/phone.svg"
import { ListItem } from "../card/list-item"
import { useIntl } from "react-intl"
import * as Switch from "@radix-ui/react-switch"

const ScopeIcons: Record<string, typeof IconPersonal> = {
  openid: IconPersonal,
  offline_access: IconPersonal,
  profile: IconPersonal,
  email: IconMessage,
  phone: Phone,
}

export function DefaultConsentScopeCheckbox({
  attributes,
  onCheckedChange,
}: OryNodeConsentScopeCheckboxProps) {
  const intl = useIntl()
  const Icon = ScopeIcons[attributes.value as string] ?? IconPersonal
  return (
    <ListItem
      as="label"
      icon={Icon}
      title={intl.formatMessage({
        id: `consent.scope.${attributes.value}.title`,
        defaultMessage: attributes.value,
      })}
      description={intl.formatMessage({
        id: `consent.scope.${attributes.value}.description`,
        defaultMessage: [],
      })}
      className="col-span-2"
      data-testid="ory/screen/consent/scope-checkbox-label"
    >
      <Switch.Root
        className="relative h-4 w-7 rounded-identifier border border-toggle-border-default bg-toggle-background-default p-[3px] transition-all data-[state=checked]:border-toggle-border-checked data-[state=checked]:bg-toggle-background-checked"
        data-testid={`ory/screen/consent/scope-checkbox`}
        value={attributes.value}
        onCheckedChange={onCheckedChange}
        defaultChecked={true}
      >
        <Switch.Thumb className="block size-2 rounded-identifier bg-toggle-foreground-default transition-all data-[state=checked]:translate-x-3 data-[state=checked]:bg-toggle-foreground-checked" />
      </Switch.Root>
    </ListItem>
  )
}
