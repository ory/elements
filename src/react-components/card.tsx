// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { JSX } from "react"

import {
  cardStyle,
  cardTitleImage,
  cardTitleStyle,
  gridStyle,
  typographyStyle,
} from "../theme"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string | React.ReactNode
  image?: string | React.ReactNode | React.FunctionComponent
  className?: string
  children?: React.ReactNode
  size?: "wide" | "default"
}

export const Card = ({
  heading,
  image,
  className,
  children,
  size,
  ...props
}: CardProps): JSX.Element => (
  <div
    className={cn(
      cardStyle({
        size,
      }),
      typographyStyle({ type: "regular", size: "small" }),
      className,
    )}
    {...props}
  >
    <div className={gridStyle({ gap: 32 })}>
      {image && (
        <>
          {typeof image === "string" ? (
            <img
              className={cardTitleImage}
              src={image}
              alt={image}
              width="100%"
              height="100%"
            />
          ) : (
            image
          )}
        </>
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
