import React from 'react';
import {CardStyle, cardStyle} from "../theme";

export type CardProps = {
  children?: React.ReactNode;
  title: string
} & CardStyle

export const Card = ({children, title, theme}: CardProps) => {
  return (
    <div className={cardStyle({theme: theme})}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
