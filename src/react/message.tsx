import React from 'react';
import { messageStyle, MessageVariants, typographyStyle } from '../theme';
import cn from 'classnames';

export type MessageProps = {
  className?: string;
  children?: React.ReactNode;
} & MessageVariants;

export const Message = ({ severity, className, children }: MessageProps) => {
  return (
    <div
      className={cn(
        messageStyle({ severity: severity }),
        typographyStyle({ size: 'small', type: 'regular' }),
        className
      )}
    >
      {children}
    </div>
  );
};
