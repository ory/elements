import React from 'react';
import { messageStyle, typographyStyle } from '../theme';
import cn from 'classnames';
import { MessageProps } from '../component-types';

export const Message = ({ severity, className, children }: MessageProps) => {
  return (
    <div
      className={cn(
        messageStyle({ severity: severity }),
        typographyStyle({ size: 'caption', type: 'regular' }),
        className
      )}
    >
      {children}
    </div>
  );
};
