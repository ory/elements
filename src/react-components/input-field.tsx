import React from 'react';
import {
  inputFieldStyle,
  inputFieldTitleStyle,
  gridStyle,
  typographyStyle
} from '../theme';
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
}: InputFieldProps): JSX.Element => {
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
        placeholder={' '} // we need this so the input css field border is not green by default
        {...props}
      />
    </div>
  );
};
