import React from "react"
import { typographyStyle } from "../theme"
import { checkboxInputStyle, checkboxStyle } from "../theme"
import cn from "classnames"

// we use the fontawesome checkmark instead of the standard checkmark
// so we need fontawesome to be loaded
import "../assets/fontawesome.min.css"
import "../assets/fa-solid.min.css"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  label?: string
}

export const Checkbox = ({
  className,
  label,
  ...props
}: CheckboxProps): JSX.Element => {
  const id = Math.random().toString(36).substring(2)
  return (
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
        {...props}
      />
      {label && (
        <label htmlFor={id}>
          <span>{label}</span>
        </label>
      )}
    </div>
  )
}
