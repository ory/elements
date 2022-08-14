import React from 'react';
import { colorSprinkle, typographyStyle } from '../theme';
import cn from 'classnames';
import { TypographyProps } from '../component-types';

export const Typography = ({
  children,
  size,
  type,
  color
}: TypographyProps) => {
  return (
    <div
      className={cn(typographyStyle({ size, type }), colorSprinkle({ color }))}
    >
      {children}
    </div>
  );
};
