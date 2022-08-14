import React from 'react';
import { gridStyle, typographyStyle } from '../theme';
import {
  inputFieldStyle,
  inputFieldTitleStyle
} from '../theme/input-field.css';
import cn from 'classnames';
import { InputFieldProps } from '../component-types';

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
        placeholder={' '} // we need this so the input css field border is not green by default
        {...props}
      />
    </div>
  );
};
