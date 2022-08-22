import React from 'react';
import { dividerStyle } from '../theme';
import cn from 'classnames';
import { DividerProps } from '../component-types';

export const Divider = ({
  className,
  fullWidth
}: DividerProps): JSX.Element => (
  <hr
    className={cn(
      dividerStyle(fullWidth ? { sizes: 'fullWidth' } : {}),
      className
    )}
  />
);
