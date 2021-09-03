import React from 'react';
import styled from 'styled-components';
import { cardStyles, CardStyles } from '../theme';

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CardStyles {}

const Card = ({ className, wide, ...props }: CardProps) => (
  <div className={className} {...props} />
);

export default styled(Card)(cardStyles);
