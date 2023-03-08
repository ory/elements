import { gridStyle } from "../../theme"
import { Button } from "../button"
import { Card } from "../card"
import { Typography } from "../typography"

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
  return (
    <Card
      className={className}
      heading={
        <div style={{ textAlign: "center" }}>
          <Typography>Do you wish to log out?</Typography>
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
              header="No"
            />
            <Button
              type="submit"
              id="accept"
              value="Yes"
              name="submit"
              variant="semibold"
              header="Yes"
            />
          </div>
        </div>
      </form>
    </Card>
  )
}
