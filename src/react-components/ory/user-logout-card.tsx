import { gridStyle } from "../../theme"
import { Button } from "../button"
import { Card } from "../card"
import { Typography } from "../typography"
import { FormattedMessage, useIntl } from "react-intl"

export type UserLogoutCardProps = {
  csrfToken: string
  challenge: string
  action: string
  className?: string
  cardImage?: string | React.ReactElement
}

export const UserLogoutCard = ({
  csrfToken,
  challenge,
  action,
  className,
  cardImage,
}: UserLogoutCardProps) => {
  const intl = useIntl()

  return (
    <Card
      className={className}
      heading={
        <div style={{ textAlign: "center" }}>
          <Typography>
            <FormattedMessage
              id="logout.title"
              defaultMessage="Do you wish to log out?"
            />
          </Typography>
        </div>
      }
      image={cardImage}
    >
      <form action={action} method="post">
        <input type="hidden" name="_csrf" value={csrfToken} />
        <input type="hidden" name="challenge" value={challenge} />
        <div className={gridStyle({ gap: 16 })}>
          <div
            className={gridStyle({ direction: "row" })}
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Button
              type="submit"
              id="reject"
              value="No"
              name="submit"
              variant="error"
              header={intl.formatMessage({
                id: "logout.reject-button",
                defaultMessage: "No",
              })}
            />
            <Button
              type="submit"
              id="accept"
              value="Yes"
              name="submit"
              variant="semibold"
              header={intl.formatMessage({
                id: "logout.accept-button",
                defaultMessage: "Yes",
              })}
            />
          </div>
        </div>
      </form>
    </Card>
  )
}
