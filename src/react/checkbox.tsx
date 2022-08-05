import React, { InputHTMLAttributes } from 'react';
import { gridStyle, typographyStyle } from '../theme';
import { checkboxInputStyle, checkboxStyle } from '../theme/checkbox.css';
import cn from 'classnames';

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
        gridStyle({ direction: 'row', gap: 8 }),
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
        <label htmlFor={id}>
          <span>{label}</span>
        </label>
      )}
    </div>
  );
};
