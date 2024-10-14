// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import cn from "classnames"
import { JSX } from "react"

import {
  checkboxInputStyle,
  checkboxStyle,
  gridStyle,
  typographyStyle,
} from "../theme"
import { Message, MessageStyleProps } from "./message"
import { useIdWithFallback } from "../common/useIdWithFallback"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    MessageStyleProps {
  className?: string
  label?: string
  helperMessage?: React.ReactNode | string
  messageTestId?: string
  dataTestid?: string
}

export const Checkbox = ({
  className,
  label,
  helperMessage,
  messageTestId,
  dataTestid,
  ...props
}: CheckboxProps): JSX.Element => {
  const id = props.id ?? useIdWithFallback()
  return (
    <div
      data-testid={dataTestid}
      className={gridStyle({ gap: 4, direction: "column" })}
    >
      <div
        className={cn(
          className,
          typographyStyle({ type: "regular", size: "caption" }),
          checkboxStyle,
        )}
      >
        <input
          className={checkboxInputStyle}
          id={id}
          type={"checkbox"}
          // we need to set a value here so that the form will submit the checkbox with a boolean type instead of an empty string
          // the value won't be submitted when the checkbox is unchecked
          value={1}
          {...props}
        />
        {label && (
          <label htmlFor={id}>
            <span>{label}</span>
          </label>
        )}
      </div>
      {typeof helperMessage === "string" ? (
        <Message
          data-testid={messageTestId}
          severity={props.severity}
          textPosition={"start"}
        >
          {helperMessage}
        </Message>
      ) : (
        helperMessage
      )}
    </div>
  )
}
