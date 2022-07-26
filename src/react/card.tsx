import React from 'react';
import {cardStyle} from "../theme";
import {typographyStyle} from "../theme";

export type CardProps = {
  title: string
  className?: string;
  children?: React.ReactNode;
}

export const Card = ({title, className, children}: CardProps) => {
  return (
    <div className={`${cardStyle()} ${typographyStyle({type: "regular", size: "small"})} ${className ? className : ''}`}>
      <h4>{title}</h4>
      {children}
    </div>
  )
}
