import React from 'react';
import {CardBase, CardProps} from "./card.base";

export const Card = ({children, title}: CardProps) => {
  return React.createElement(CardBase({children, title}));
}
