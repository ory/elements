import React from "react"
import { SelfServiceError } from "@ory/client"
import { colorSprinkle, gridStyle } from "../../theme"
import { ButtonLink } from "../button-link"
import { Card } from "../card"
import { Message } from "../message"

// SelfServiceErrorCard props
export type UserErrorCardProps = {
  title: string
  error: SelfServiceError
  backURL: string
  contactSupportEmail?: string
}

type errorMessage = {
  id: string
  message: string
  reason: string
  status: string
}

export const UserErrorCard = ({
  title,
  error,
  backURL,
  contactSupportEmail,
}: UserErrorCardProps): JSX.Element => {
  const err = error.error as errorMessage
  return (
    <Card title={title}>
      <div className={gridStyle({ gap: 32 })}>
        <Message severity="error" data-testid={`ui/error/message`}>
          An error occurred with the following message:&nbsp;
          {err.reason}
        </Message>
        {contactSupportEmail && (
          <Message className={colorSprinkle({ color: "foregroundMuted" })}>
            If the problem persists, please contact&nbsp;
            <ButtonLink href={`mailto:${contactSupportEmail}`}>
              {contactSupportEmail}
            </ButtonLink>
          </Message>
        )}
        <Message>
          <ButtonLink href={backURL}>Go Back</ButtonLink>
        </Message>
      </div>
    </Card>
  )
}
