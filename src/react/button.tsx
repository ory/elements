import React from "react"
import { ButtonStyle, buttonStyle } from "../theme/button.css"

type buttonStyle = ButtonStyle & {}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, buttonStyle {
    title: string
    className?: string
}

export const Button = ({ title, size, variant, className, ...props }: ButtonProps) => (
    <div className={className}>
        <button className={buttonStyle({ size, variant })} {...props}>
            {title}
        </button>
    </div>
)