import React from 'react';
import { ButtonProps } from '../component-types';
import { buttonStyle } from '../theme/button.css';

export const Button = ({
  title,
  size,
  variant,
  fullWidth,
  className,
  ...props
}: ButtonProps) => (
  <div className={className}>
    <button
      className={buttonStyle({ size, variant })}
      style={{ width: fullWidth ? '100%' : 'auto' }}
      {...props}
    >
      {title}
    </button>
  </div>
);
