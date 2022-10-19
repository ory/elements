import cn from "classnames"
import React from "react"
import {
  buttonSocialIconEndStyle,
  buttonSocialIconStartStyle,
  ButtonSocialStyle,
  buttonSocialStyle,
} from "../theme/button-social.css"

// required FontAwesome Icons for Brands
import "../assets/fa-brands.min.css"
import "../assets/fa-solid.min.css"
import "../assets/fontawesome.min.css"

// required since interfaces cannot extend types whose properties are not statically known
type buttonSocialStyle = ButtonSocialStyle & Record<string, unknown>

export interface ButtonSocialProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonSocialStyle {
  header: string
  brand: string
  fullWidth?: boolean
  className?: string
}

export const ButtonSocial = ({
  header: title,
  brand,
  size,
  variant,
  fullWidth,
  className,
  ...props
}: ButtonSocialProps): JSX.Element => {
  const brandClass =
    brand !== "generic" ? `fa-brands fa-${brand}` : "fa-solid fa-layer-group"
  return (
    <div className={className}>
      <button
        className={buttonSocialStyle({ size, variant })}
        style={{ width: fullWidth ? "100%" : "auto" }}
        {...props}
      >
        <i className={cn(brandClass, buttonSocialIconStartStyle({ size }))}></i>
        {title}
        {/* add another hidden icon to the end to center the text */}
        <i
          className={cn(brandClass, buttonSocialIconEndStyle({ size }))}
          style={{ visibility: "hidden", opacity: 0 }}
        ></i>
      </button>
    </div>
  )
}
