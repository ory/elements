import { FlowError } from "@ory/client"

import { colorSprinkle, gridStyle, typographyStyle } from "../../theme"
import { ButtonLink, CustomHref } from "../button-link"
import { Card } from "../card"
import { CodeBox } from "../codebox"
import { Message } from "../message"

// SelfServiceErrorCard props
export type UserErrorCardProps = {
  title: string
  error: FlowError
  backUrl: CustomHref | string
  cardImage?: string | React.ReactElement
  contactSupportEmail?: string
  className?: string
}

type errorMessage = {
  id: string
  message: string
  reason: string
  status: string
  code: number
}

export const UserErrorCard = ({
  title,
  error,
  backUrl,
  cardImage,
  contactSupportEmail,
  className,
}: UserErrorCardProps): JSX.Element => {
  const err = error.error as errorMessage
  const status = err.code
  const message = status >= 500 ? JSON.stringify(error, null, 2) : err.reason
  return (
    <Card
      className={className}
      heading={
        <h2 className={typographyStyle({ type: "regular", size: "small" })}>
          {title}
        </h2>
      }
      image={cardImage}
    >
      <div
        className={gridStyle({ gap: 32, direction: "column" })}
        data-testid={`ui/error/message`}
      >
        <Message severity="error">
          An error occurred with the following message:&nbsp;
          {status < 500 && message}
        </Message>
        {status >= 500 && <CodeBox data-testid={"code-box"}>{message}</CodeBox>}
        {contactSupportEmail && (
          <Message className={colorSprinkle({ color: "foregroundMuted" })}>
            If the problem persists, please contact&nbsp;
            <ButtonLink href={`mailto:${contactSupportEmail}`}>
              {contactSupportEmail}
            </ButtonLink>
          </Message>
        )}
        <Message>
          <ButtonLink href={backUrl}>Go Back</ButtonLink>
        </Message>
      </div>
    </Card>
  )
}
