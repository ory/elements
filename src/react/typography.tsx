import React from 'react';
import {
  colorStyle,
  ColorStyle,
  TypographyStyle,
  typographyStyle
} from '../theme';
import cn from 'classnames';

type typographyStyle = TypographyStyle & {};
type colorStyle = ColorStyle & {};

export interface TypographyProps
  extends React.BaseHTMLAttributes<HTMLBaseElement>,
    typographyStyle,
    colorStyle {
  children: React.ReactNode;
}

export const Typography = ({
  children,
  size,
  type,
  themeColor
}: TypographyProps) => {
  return (
    <div
      className={cn(
        typographyStyle({ size, type }),
        colorStyle({ themeColor })
      )}
    >
      {children}
    </div>
  );
};
