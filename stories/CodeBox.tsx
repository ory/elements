import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { codeBoxStyles } from '../theme';
import { Code } from './Typography';

export interface CodeBoxProps extends React.HTMLAttributes<HTMLPreElement> {
  code: string;
}

const CodeBox = ({ children, code, ...props }: CodeBoxProps) => (
  <pre {...props}>
    <Code dangerouslySetInnerHTML={{ __html: code }} />
  </pre>
);

export default styled(CodeBox)(codeBoxStyles);
