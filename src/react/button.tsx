import { style } from '@vanilla-extract/css';
import React from 'react';
import { ButtonStyle, buttonStyle } from '../theme/button.css';

type buttonStyle = ButtonStyle & {};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonStyle {
  title: string;
  fullWidth?: boolean;
  className?: string;
}

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
