import cn from "classnames"

import {
  cardStyle,
  cardTitleImage,
  cardTitleStyle,
  gridStyle,
  typographyStyle,
} from "../theme"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string | React.ReactNode
  image?: string | React.ReactNode
  className?: string
  children?: React.ReactNode
}

export const Card = ({
  heading,
  image,
  className,
  children,
  ...props
}: CardProps): JSX.Element => (
  <div
    className={cn(
      cardStyle(),
      typographyStyle({ type: "regular", size: "small" }),
      className,
    )}
    {...props}
  >
    <div className={gridStyle({ gap: 32 })}>
      {image && (
        <div className={cardTitleImage}>
          {typeof image === "string" ? (
            <img
              style={{
                width: "auto",
              }}
              src={image}
              alt={image}
              width="100%"
              height="100%"
            />
          ) : (
            image
          )}
        </div>
      )}

      <div className={cardTitleStyle}>
        {typeof heading === "string" ? (
          <h3 className={typographyStyle({ type: "regular", size: "small" })}>
            {heading}
          </h3>
        ) : (
          heading
        )}
      </div>
      <div>{children}</div>
    </div>
  </div>
)
