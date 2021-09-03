import React, { ComponentType, InputHTMLAttributes, ReactNode } from 'react';
import styled, { StyledComponent } from 'styled-components';
import {
  textInputStyles,
  typographyCaptionStyles,
  typographyH3Styles,
  ThemeProps,
  TextInputProps as StyledTextInputProps
} from '../theme';

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    StyledTextInputProps {
  subtitle?: ReactNode;
  helper?: ReactNode;
}

const Field: StyledComponent<
  ComponentType<
    ThemeProps & InputHTMLAttributes<HTMLInputElement> & StyledTextInputProps
  >,
  any
> = styled.input(textInputStyles);

const Subtitle: StyledComponent<
  ComponentType<StyledTextInputProps & React.HTMLAttributes<HTMLDivElement>>,
  any
> = styled.div(typographyCaptionStyles);

const Title: StyledComponent<
  ComponentType<StyledTextInputProps & React.HTMLAttributes<HTMLDivElement>>,
  any
> = styled.div(typographyH3Styles);

const TextInput = ({
  className,
  title,
  subtitle,
  disabled,
  type = 'text',
  ...props
}: TextInputProps) => {
  let state = props.state;
  if (disabled) {
    state = 'disabled';
  }

  return (
    <div className={className}>
      {title && (
        <Title state={state} className={className}>
          {title}
        </Title>
      )}
      <Field {...props} state={state} type={type} className={className} />
      {subtitle && (
        <Subtitle state={state} className={className}>
          {subtitle}
        </Subtitle>
      )}
    </div>
  );
};

export default TextInput;
