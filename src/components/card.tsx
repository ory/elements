import React from 'react';
import {CardBase, CardProps} from "./card.base";

export const Card = ({children, title, size}: CardProps) => {
  return React.createElement(CardBase({children, title, size}));
}
