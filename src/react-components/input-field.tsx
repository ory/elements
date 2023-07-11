import cn from "classnames"

import {
  gridStyle,
  inputFieldStyle,
  inputFieldTitleStyle,
  typographyStyle,
} from "../theme"
import { Message, MessageStyleProps } from "./message"
import { useIdWithFallback } from '../common/useIdWithFallback'

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
  id,
  ...props
}: InputFieldProps): JSX.Element => {
  const inputId = id ?? useIdWithFallback()

  return (
    <div
      data-testid={dataTestid}
      className={cn(className, gridStyle({ gap: 4 }))}
    >
      {title && (
        <label
          htmlFor={inputId}
          className={typographyStyle({ size: "small", type: "regular" })}
        >
          {title}{" "}
          {props.required && <span className={inputFieldTitleStyle}>*</span>}
        </label>
      )}
      <input
        className={cn(
          inputFieldStyle,
          typographyStyle({ size: "small", type: "regular" }),
        )}
        style={{ width: fullWidth ? "100%" : "auto" }}
        placeholder={" "} // we need this so the input css field border is not green by default
        id={inputId}
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
