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
    >
      <Switch.Root
        className="relative w-7 h-4 bg-toggle-background-default rounded-identifier border-toggle-border-default border p-[3px] data-[state=checked]:bg-toggle-background-checked transition-all data-[state=checked]:border-toggle-border-checked"
        onCheckedChange={onCheckedChange}
        defaultChecked={attributes.value}
      >
        <Switch.Thumb className="size-2 block bg-toggle-foreground-default rounded-identifier data-[state=checked]:bg-toggle-foreground-checked transition-all data-[state=checked]:translate-x-3" />
      </Switch.Root>
    </ListItem>
  )
}
