import React from 'react';
import { messageStyle, MessageStyle, typographyStyle } from '../theme';
import cn from 'classnames';

type messageProps = MessageStyle & {};

export interface MessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    messageProps {
  className?: string;
  children?: React.ReactNode;
}

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
