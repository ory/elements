import React, { InputHTMLAttributes } from 'react';
import { gridStyle, typographyStyle } from '../theme';
import {
  checkboxInputStyle,
  checkboxLabelStyle,
  checkboxStyle
} from '../theme/checkbox.css';
import cn from 'classnames';

// we use the fontawesome checkmark instead of the standard checkmark
// so we need fontawesome to be loaded
import '../../public/fontawesome.min.css';
import '../../public/fa-solid.min.css';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  children?: React.ReactNode;
}

export const Checkbox = ({
  className,
  label,
  children,
  ...props
}: CheckboxProps) => {
  const id = Math.random().toString(36).substring(2);
  return (
    <div
      className={cn(
        className,
        typographyStyle({ type: 'regular', size: 'caption' }),
        checkboxStyle
      )}
    >
      <input
        className={checkboxInputStyle}
        id={id}
        type={'checkbox'}
        {...props}
      />
      {label && (
        <label className={checkboxLabelStyle} htmlFor={id}>
          <span>{label}</span>
        </label>
      )}
    </div>
  );
};
