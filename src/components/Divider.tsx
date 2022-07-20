import React from 'react';
import styled from 'styled-components';
import { dividerStyles, DividerStyles } from "../theme/dividerStyles";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement>, DividerStyles {}

const Divider = ({ className, ...props }: DividerProps) => (
  <div className={className} {...props} />
);

export default styled(Divider)(dividerStyles);
