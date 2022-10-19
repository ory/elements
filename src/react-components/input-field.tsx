import cn from "classnames"
import React from "react"
import {
  gridStyle,
  inputFieldStyle,
  inputFieldTitleStyle,
  typographyStyle,
} from "../theme"
import { Message, MessageStyleProps } from "./message"

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    MessageStyleProps {
  header: string
  helperMessage?: React.ReactNode | string
  messageTestId?: string
  dataTestid?: string
  fullWidth?: boolean
  className?: string
}

export const InputField = ({
  header: title,
  helperMessage,
  messageTestId,
  fullWidth,
  className,
  dataTestid,
  ...props
}: InputFieldProps): JSX.Element => {
  return (
    <div
      data-testid={dataTestid}
      className={cn(className, gridStyle({ gap: 4 }))}
    >
      {title && (
        <div className={typographyStyle({ size: "small", type: "regular" })}>
          {title}{" "}
          {props.required && <span className={inputFieldTitleStyle}>*</span>}
        </div>
      )}
      <input
        className={cn(
          inputFieldStyle,
          typographyStyle({ size: "small", type: "regular" }),
        )}
        style={{ width: fullWidth ? "100%" : "auto" }}
        placeholder={" "} // we need this so the input css field border is not green by default
        {...props}
      />
      {typeof helperMessage === "string" ? (
        <Message data-testid={messageTestId} severity={props.severity}>
          {helperMessage}
        </Message>
      ) : (
        helperMessage
      )}
    </div>
  )
}
