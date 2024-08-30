import { HeadlessAuthMethodListItemProps } from "../../../../types"

import { FunctionComponent, SVGAttributes } from "react"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"

// TODO: create a next specific component with Image for this
export function DefaultAuthMethodListItem({
  onClick,
  group,
}: HeadlessAuthMethodListItemProps) {
  let Icon: FunctionComponent<SVGAttributes<SVGElement>> | null = null
  let title = ""
  let description = ""

  switch (group) {
    case "passkey":
      Icon = passkey
      title = "Passkey (recommended)"
      description = "Use your devices for fringerprint or face recognition"
      break
    case "password":
      Icon = password
      title = "Password"
      description = "Enter the password associated with your account"
      break
    case "webauthn":
      Icon = webauthn
      title = "Security Key"
      description =
        "Use the signature of one of your cryptographic hardware keys to authenticate"
      break
    case "code":
      Icon = code
      title = "Email"
      description = "A verification code will be sent to your email"
      break
  }

  return (
    <div
      className={
        "flex py-2 gap-3 cursor-pointer hover:bg-button-secondary-bg-hover"
      }
      onClick={onClick}
    >
      <div className={"flex-none w-4 h-4 mt-[2px]"}>
        {Icon && <Icon className="w-5 h-5" width={16} height={16} />}
      </div>
      <div className={"flex-1 text-sm leading-normal"}>
        <div className="text-forms-fg-default text-sm">{title}</div>
        <div className="text-forms-fg-mute text-sm">{description}</div>
      </div>
    </div>
  )
}
