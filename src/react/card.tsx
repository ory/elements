import React from 'react';
import { cardStyle } from "../theme";
import { typographyStyle } from "../theme";
import cn from "classnames";

export type CardProps = {
  title: string
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({ title, className, children }: CardProps) => (
  <div className={cn(cardStyle(), typographyStyle({ type: "regular", size: "small" }), className)}>
    <h4>{title}</h4>
    {children}
  </div>
)
