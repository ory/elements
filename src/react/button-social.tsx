import { buttonSocialIconStyle, ButtonSocialStyle, buttonSocialStyle, buttonSocialTitleStyle } from "../theme/button-social.css"
import { ButtonProps } from "./button";
import cn from "classnames";

// required FontAwesome Icons for Brands
import "../assets/brands-icons.min.css";

type buttonSocialStyle = ButtonSocialStyle & {}

export interface ButtonSocialProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, buttonSocialStyle {
    title: string
    brand: string
    className?: string
}

export const ButtonSocial = ({ title, brand, size, variant, className }: ButtonSocialProps) => (
    <div className={className}>
        <button className={buttonSocialStyle({ size, variant })}>
            <span className={cn(`fa-brands fa-${brand}`, buttonSocialIconStyle({ size }))} />
            <div className={buttonSocialTitleStyle}>
                {title}
            </div>
        </button>
    </div>
)