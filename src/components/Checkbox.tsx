import React from 'react';
import styled from 'styled-components';
import { checkboxStyles } from '../theme';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
  label?: string;
}

const Checkbox = ({ title, label, className, ...props }: CheckboxProps) => {
  const id = Math.random().toString(36).substring(2);
  return (
    <div className={className}>
      {title && <div className={'checkbox-title'}>{title}</div>}
      <div className="checkbox-inner">
        <input id={id} type="checkbox" {...props} />
        {label && (
          <label htmlFor={id}>
            <svg
              width="8"
              height="7"
              viewBox="0 0 8 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.75 1.8125L2.75 6.8125L0.25 4.3125L1.1875 3.375L2.75 4.9375L6.8125 0.875L7.75 1.8125Z"
                fill="#F9F9FA"
              />
            </svg>
            <span>{label}</span>
          </label>
        )}
      </div>
    </div>
  );
};

export default styled(Checkbox)(checkboxStyles);
