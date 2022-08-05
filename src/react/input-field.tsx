import React from 'react';
import { gridStyle, typographyStyle } from '../theme';
import {
  inputFieldStyle,
  inputFieldTitleStyle
} from '../theme/input-field.css';
import cn from 'classnames';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  fullWidth?: boolean;
  className?: string;
}

export const InputField = ({
  title,
  fullWidth,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <div className={cn(className, gridStyle({ gap: 4 }))}>
      {title && (
        <div className={typographyStyle({ size: 'small', type: 'regular' })}>
          {title}{' '}
          {props.required && <span className={inputFieldTitleStyle}>*</span>}
        </div>
      )}
      <input
        className={cn(
          inputFieldStyle,
          typographyStyle({ size: 'small', type: 'regular' })
        )}
        style={{ width: fullWidth ? '100%' : 'auto' }}
        {...props}
      />
    </div>
  );
};
