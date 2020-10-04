import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { buttonStyles, ButtonStyles } from '../theme';

export interface ButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    ButtonStyles {
  helper?: ReactNode;
  children: string;
}

const Button = ({ helper, children, className, ...props }: ButtonProps) => (
  <div className={className}>
    <input type="button" className="button" {...props} value={children} />
    {helper && <span className="button-helper">{helper}</span>}
  </div>
);

export default styled(Button)(buttonStyles);
