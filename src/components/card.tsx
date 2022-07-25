import React from 'react';
import {cardStyle} from "../theme";

export type CardProps = {
  children?: React.ReactNode;
  title: string
}

export const Card = ({children, title}: CardProps) => {
  return (
    <div className={cardStyle()}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
