// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { gridStyle } from "../../theme"
import { Button } from "../button"
import { Card } from "../card"
import { Typography } from "../typography"

import { OAuth2Client, OAuth2ConsentRequest } from "@ory/client"

import { Checkbox } from "../checkbox"
import { Divider } from "../divider"
import { FormattedMessage, useIntl } from "react-intl"

/**
 * UserConsentCardProps
 * @param csrfToken - CSRF token
 * @param consent - Ory OAuth2ConsentRequest
 * @param cardImage - card image is usually the logo of the client
 * @param client_name - the client name to display to the user
 * @param requested_scope - a list of requested scope
 * @param client - Ory OAuth2Client
 * @param action - the URL used for the form action
 * @param className - css class overrides for the UserConsentCard
 */
export interface UserConsentCardProps {
  csrfToken: string
  consent: OAuth2ConsentRequest
  cardImage?: string | React.ReactElement
  client_name: string
  requested_scope?: string[]
  client?: OAuth2Client
  action: string
  className?: string
}

export const UserConsentCard = ({
  csrfToken,
  consent,
  cardImage,
  client_name = "Unnamed Client",
  requested_scope = [],
  client,
  action,
  className,
}: UserConsentCardProps) => {
  const intl = useIntl()

  return (
    <Card
      className={className}
      heading={
        <div style={{ textAlign: "center" }}>
          <Typography type="bold">{client_name}</Typography>
        </div>
      }
      image={cardImage}
    >
      <form action={action} method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input
          type="hidden"
          name="consent_challenge"
          value={consent?.challenge}
        />
        <div className={gridStyle({ gap: 16 })}>
          <div className={gridStyle({ gap: 4 })} style={{ marginBottom: 16 }}>
            <Typography>
              <FormattedMessage
                id="consent.requested-permissions-label"
                defaultMessage="The application requests access to the following permissions:"
              />
            </Typography>
          </div>
          <div className={gridStyle({ gap: 4 })}>
            {requested_scope.map((scope) => (
              <Checkbox
                key={scope}
                label={scope}
                value={scope}
                name="grant_scope"
              />
            ))}
          </div>
          <div className={gridStyle({ gap: 4 })}>
            <Typography size="xsmall">
              <FormattedMessage
                id="consent.description"
                defaultMessage="Only grant permissions if you trust this site or app. You do not need to accept all permissions."
              />
            </Typography>
          </div>
          <div className={gridStyle({ direction: "row" })}>
            {client?.policy_uri && (
              <a href={client.policy_uri} target="_blank" rel="noreferrer">
                <Typography size="xsmall">
                  <FormattedMessage
                    id="consent.privacy-policy-label"
                    defaultMessage="Privacy Policy"
                  />
                </Typography>
              </a>
            )}
            {client?.tos_uri && (
              <a href={client.tos_uri} target="_blank" rel="noreferrer">
                <Typography size="xsmall">
                  <FormattedMessage
                    id="consent.terms-of-service-label"
                    defaultMessage="Terms of Service"
                  />
                </Typography>
              </a>
            )}
          </div>
          <Divider />
          <div className={gridStyle({ gap: 8 })}>
            <Checkbox
              label={intl.formatMessage({
                id: "consent.remember-tooltip",
                defaultMessage: "remember my decision",
              })}
              id="remember"
              name="remember"
            />
            <Typography size="xsmall">
              <FormattedMessage
                id="consent.remember-label"
                defaultMessage="Remember this decision for next time. The application will not be able to ask for additional permissions without your consent."
              />
            </Typography>
          </div>
          <div
            className={gridStyle({ direction: "row" })}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Button
              type="submit"
              id="reject"
              name="consent_action"
              value="reject"
              variant="error"
              header={intl.formatMessage({
                id: "consent.action-reject",
                defaultMessage: "Deny",
              })}
            />
            <Button
              type="submit"
              id="accept"
              name="consent_action"
              value="accept"
              variant="semibold"
              header={intl.formatMessage({
                id: "consent.action-accept",
                defaultMessage: "Allow",
              })}
            />
          </div>
        </div>
      </form>
    </Card>
  )
}
