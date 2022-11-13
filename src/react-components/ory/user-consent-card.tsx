import { gridStyle, typographyStyle } from "../../theme"
import { Button } from "../button"
import { ButtonLink } from "../button-link"
import { Card } from "../card"
import { Typography } from "../typography"

import "../../assets/fontawesome.min.css"
import "../../assets/fa-solid.min.css"
import { Checkbox } from "../checkbox"
import { OAuth2Client, OAuth2ConsentRequest } from "@ory/client"
import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { Divider } from "../divider"

export type UserConsentCardProps = {
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
              The application requests access to the following permissions:
            </Typography>
          </div>
          <div className={gridStyle({ gap: 4 })}>
            {requested_scope.map((scope) => (
              <Checkbox label={scope} value={scope} name="grant_scope" />
            ))}
          </div>
          <div className={gridStyle({ gap: 4 })}>
            <Typography size="xsmall">
              Only grant permissions if you trust this site or app. You do not
              need to accept all permissions.
            </Typography>
          </div>
          <div className={gridStyle({ direction: "row" })}>
            {client?.policy_uri && (
              <a href={client.policy_uri} target="_blank">
                <Typography size="xsmall">Privacy Policy</Typography>
              </a>
            )}
            {client?.tos_uri && (
              <a href={client.tos_uri} target="_blank">
                <Typography size="xsmall">Terms of Service</Typography>
              </a>
            )}
          </div>
          <Divider />
          <div className={gridStyle({ gap: 8 })}>
            <Checkbox
              label="Remember my decision"
              id="remember"
              name="remember"
            />
            <Typography size="xsmall">
              Remember this decision for next time. The application will not be
              able to ask for additional permissions without your consent.
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
              header="Deny"
            />
            <Button
              type="submit"
              id="accept"
              name="consent_action"
              value="accept"
              variant="semibold"
              header="Allow"
            />
          </div>
        </div>
      </form>
    </Card>
  )
}
