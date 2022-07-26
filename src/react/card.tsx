import React from 'react';
import {cardStyle} from "../theme";
import {typography} from "../theme/typography.css";

export type CardProps = {
  title: string
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({title, className, children}: CardProps) => {
  return (
    <div className={`${cardStyle()} ${typography({type: "regular", size: "small"})} ${className ? className : ''}`}>
      <h4>{title}</h4>
      {children}
    </div>
  )
}
