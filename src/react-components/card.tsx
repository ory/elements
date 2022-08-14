import React from 'react';
import { cardStyle, cardTitleStyle, gridStyle } from '../theme';
import { typographyStyle } from '../theme';
import cn from 'classnames';
import { CardProps } from '../component-types';

export const Card = ({ title, className, children }: CardProps) => (
  <div
    className={cn(
      cardStyle(),
      typographyStyle({ type: 'regular', size: 'small' }),
      className
    )}
  >
    <div className={gridStyle({ gap: 32 })}>
      <h4 className={cardTitleStyle}>{title}</h4>
      <div>{children}</div>
    </div>
  </div>
);
