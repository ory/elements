import { HeadlessAuthMethodListItemProps } from "../../../../types"

import { FunctionComponent, SVGAttributes } from "react"
import code from "../../assets/icons/code.svg"
import passkey from "../../assets/icons/passkey.svg"
import password from "../../assets/icons/password.svg"
import webauthn from "../../assets/icons/webauthn.svg"

// TODO: create a next specific component with Image for this
export function DefaultAuthMethodListItem({
  setGroups,
  setStep,
  group,
}: HeadlessAuthMethodListItemProps) {
  let Icon: FunctionComponent<SVGAttributes<SVGElement>> | null = null
  let title = ""
  let description = ""

  switch (group) {
    case "passkey":
      Icon = passkey
      title = "Passkey"
      description = "Use your fingerprint or face to sign in."
      break
    case "password":
      Icon = password
      title = "Password"
      description = "Use your password to sign in."
      break
    case "webauthn":
      Icon = webauthn
      title = "Security Key"
      description = "Use a security key to sign in."
      break
    case "code":
      Icon = code
      title = "Email"
      description = "Enter a code sent to your email."
      break
  }

  return (
    <div
      className={
        "flex py-2 gap-3 cursor-pointer hover:bg-button-secondary-bg-hover"
      }
      onClick={() => {
        setGroups([group])
        setStep(2)
      }}
    >
      <div className={"flex-none w-4 h-4 mt-[2px]"}>
        {Icon && <Icon className="w-5 h-5" width={16} height={16} />}
      </div>
      <div className={"flex-1 text-sm leading-normal"}>
        <div className="text-forms-fg-default">{title}</div>
        <div className="text-forms-fg-subtle">{description}</div>
      </div>
    </div>
  )
}
