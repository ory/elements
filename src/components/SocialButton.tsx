import React from "react";
import {SocialButtonStyles, socialButtonStyles} from "../theme/socialButtonStyles";
import styled from "styled-components";
import "../css/webfonts/brands.min.css";

export interface SocialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, SocialButtonStyles {
  children: string;
  brand: string
}

const SocialButton = ({className, brand, ...props}: SocialButtonProps) => (
  <div className={className}>
    <button className={"button"} {...props} >
      <span className={`fa-brands fa-${brand}`}/>
      <div className={"button-text"}>{props.children}</div>
    </button>
  </div>
);

export default styled(SocialButton)(socialButtonStyles);
