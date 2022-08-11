import React from 'react';
import {
  colorSprinkle,
  ColorSprinkle,
  TypographyStyle,
  typographyStyle
} from '../theme';
import cn from 'classnames';

type typographyStyle = TypographyStyle & {};
type colorSprinkle = ColorSprinkle & {};
export interface TypographyProps
  extends Omit<React.BaseHTMLAttributes<HTMLBaseElement>, 'color'>,
    typographyStyle,
    colorSprinkle {
  children: React.ReactNode;
}

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
