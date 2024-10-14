// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowError } from "@ory/client"
import { JSX } from "react"

import { colorSprinkle, gridStyle, typographyStyle } from "../../theme"
import { ButtonLink, CustomHref } from "../button-link"
import { Card } from "../card"
import { CodeBox } from "../codebox"
import { Message } from "../message"
import { FormattedMessage, useIntl } from "react-intl"

/**
 * UserErrorCardProps
 * @param title - the title of the error card
 * @param error - Ory FlowError
 * @param backUrl - the URL to redirect the user to. A custom function can be passed to the CustomHref type
 * @param cardImage - card image is usually the company logo
 * @param contactSupportEmail - the email address to contact support
 * @param className - css class overrides for the UserErrorCard
 */
export interface UserErrorCardProps {
  title?: string
  error: FlowError
  backUrl: CustomHref | string
  cardImage?: string | React.ReactElement
  contactSupportEmail?: string
  className?: string
}

interface errorMessage {
  id: string
  message: string
  reason: string
  status: string
  code: number
}

/**
 * UserErrorCard renders an error card for the user
 * @see UserErrorCardProps
 */
export const UserErrorCard = ({
  title,
  error,
  backUrl,
  cardImage,
  contactSupportEmail,
  className,
}: UserErrorCardProps): JSX.Element => {
  const intl = useIntl()

  const err = error.error as errorMessage
  const status = err.code
  const is500 = status >= 500

  if (!title) {
    switch (status) {
      case 404:
        title = intl.formatMessage({
          id: "error.title-not-found",
          defaultMessage: "404 - Page not found",
        })
        break
      case 500:
        title = intl.formatMessage({
          id: "error.title-internal-server-error",
          defaultMessage: "Internal Server Error",
        })
        break
      default:
        title = intl.formatMessage({
          id: "error.title",
          defaultMessage: "An error occurred",
        })
    }
  }

  return (
    <Card
      className={className}
      heading={
        <h2 className={typographyStyle({ type: "regular", size: "small" })}>
          {title}
        </h2>
      }
      image={cardImage}
      size="wide"
    >
      <div
        className={gridStyle({ gap: 32, direction: "column" })}
        data-testid="ui/error/message"
      >
        {!is500 && (
          <Message severity="error">
            <FormattedMessage
              id="error.description"
              defaultMessage="An error occurred with the following message:"
            />
            &nbsp;
            {err.reason}
          </Message>
        )}
        <CodeBox data-testid="code-box" toggleText="Error details">
          {JSON.stringify(error, null, 2)}
        </CodeBox>
        {contactSupportEmail && (
          <Message className={colorSprinkle({ color: "foregroundMuted" })}>
            <FormattedMessage
              id="error.support-email-link"
              description="A label and link below the error. The link href is 'mailto:{contactSupportEmail}'."
              defaultMessage="If the problem persists, please contact <a>{contactSupportEmail}</a>"
              values={{
                contactSupportEmail,
                a: (chunks) => (
                  <ButtonLink href={`mailto:${contactSupportEmail}`}>
                    &nbsp;{chunks}
                  </ButtonLink>
                ),
              }}
            />
          </Message>
        )}
        <Message>
          <ButtonLink href={backUrl}>
            <FormattedMessage id="error.back-button" defaultMessage="Go Back" />
          </ButtonLink>
        </Message>
      </div>
    </Card>
  )
}
