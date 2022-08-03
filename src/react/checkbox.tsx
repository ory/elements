import React, { InputHTMLAttributes } from 'react';
import { typographyStyle } from '../theme';
import { checkboxStyle } from '../theme/checkbox.css';
import cn from 'classnames';

import '../assets/fontawesome.min.css';
import '../assets/regular.min.css';

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
        typographyStyle({ type: 'regular', size: 'caption' })
      )}
    >
      <input className={checkboxStyle} id={id} type={'checkbox'} {...props} />
      {label && (
        <label htmlFor={id}>
          <span>{label}</span>
        </label>
      )}
    </div>
  );
};
