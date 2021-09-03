import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { buttonStyles, ButtonStyles } from '../theme';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyles {
  helper?: ReactNode;
  children: string;
}

const Button = ({ helper, className, ...props }: ButtonProps) => (
  <div className={className}>
    <button className="button" {...props} />
    {helper && <span className="button-helper">{helper}</span>}
  </div>
);

export default styled(Button)(buttonStyles);
