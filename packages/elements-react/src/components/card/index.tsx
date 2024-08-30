import { OryForm } from "../form/form"
import { OryFormGroups } from "../form/groups"
import { OryCardValidationMessages } from "../form/messages"
import { OryFormSocialButtons } from "../form/social"
import { useComponents } from "../../context/component"
import { ComponentType, PropsWithChildren } from "react"
import { OryCardHeader, OryCardHeaderProps } from "./header"

export type OryCardContentProps = PropsWithChildren

export function OryCardContent({ children }: OryCardContentProps) {
  const { CardContent } = useComponents()

  if (children) {
    return <CardContent>{children}</CardContent>
  }

  return (
    <CardContent>
      <OryCardValidationMessages />
      <OryForm>
        <OryFormGroups
          groups={[
            "default",
            "password",
            "passkey",
            "code",
            "webauthn",
            "profile",
            "totp",
            "identifier_first",
          ]}
        />
      </OryForm>
    </CardContent>
  )
}

export type OryCardFooterProps = Record<string, never>

export function OryCardFooter() {
  const { CardFooter } = useComponents()
  return <CardFooter />
}

export type OryCardProps = PropsWithChildren

export function OryCard({ children }: OryCardProps) {
  const { Card } = useComponents()

  if (children) {
    return <Card>{children}</Card>
  }

  return (
    <Card>
      <OryCardHeader />
      <OryCardContent />
      <OryCardFooter />
    </Card>
  )
}

/**
 * Card components are used to show login, registration, recovery, and verification flows.
 */
export type OryCardComponents = {
  /**
   * The card container is the main container of the card.
   */
  Card: ComponentType<OryCardProps>

  /**
   * The card footer is the footer of the card container.
   */
  CardFooter: ComponentType<OryCardFooterProps>

  /**
   * The card header is the header of the card container.
   */
  CardHeader: ComponentType<OryCardProps>

  /**
   * The card content is the main content of the card container.
   */
  CardContent: ComponentType<OryCardContentProps>

  /**
   * The card logo is the logo of the card container.
   */
  CardLogo: ComponentType
}

export { OryCardHeader }

export type { OryCardHeaderProps }
