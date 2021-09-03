import React from 'react';
import styled from 'styled-components';
import { alertStyles, AlertStyles } from '../theme';

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    AlertStyles {}

const Alert = ({ severity, ...props }: AlertProps) => <div {...props} />;

export default styled(Alert)(alertStyles);
