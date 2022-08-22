import React from 'react';
import {
  buttonSocialIconStyle,
  ButtonSocialStyle,
  buttonSocialStyle,
  buttonSocialTitleStyle
} from '../theme/button-social.css';
import cn from 'classnames';

// required FontAwesome Icons for Brands
import '../assets/fontawesome.min.css';
import '../assets/fa-brands.min.css';
import '../assets/fa-solid.min.css';

// required since interfaces cannot extend types whose properties are not statically known
type buttonSocialStyle = ButtonSocialStyle & Record<string, unknown>;

export interface ButtonSocialProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    buttonSocialStyle {
  title: string;
  brand: string;
  fullWidth?: boolean;
  className?: string;
}

export const ButtonSocial = ({
  title,
  brand,
  size,
  variant,
  fullWidth,
  className,
  ...props
}: ButtonSocialProps): JSX.Element => {
  const brandClass =
    brand !== 'generic' ? `fa-brands fa-${brand}` : 'fa-solid fa-layer-group';
  return (
    <div className={className}>
      <button
        className={buttonSocialStyle({ size, variant })}
        style={{ width: fullWidth ? '100%' : 'auto' }}
        {...props}
      >
        <i className={cn(brandClass, buttonSocialIconStyle({ size }))}></i>
        <div className={buttonSocialTitleStyle}>{title}</div>
      </button>
    </div>
  );
};
