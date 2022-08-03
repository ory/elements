import React from 'react';

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const InputField = ({ className, ...props }: InputFieldProps) => {
  return <input className={className} {...props} />;
};
