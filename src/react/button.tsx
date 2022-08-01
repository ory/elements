import React from "react"
import { ButtonStyle, buttonStyle } from "../theme/button.css"

export type ButtonProps = {
    title: string
    className?: string
} & ButtonStyle

export const Button = ({ title, size, type, className }: ButtonProps) => (
    <div className={className}>
        <button className={buttonStyle({ size, type })}>
            {title}
        </button>
    </div>
)