import {
  buttonSocialIconStyle,
  ButtonSocialStyle,
  buttonSocialStyle,
  buttonSocialTitleStyle
} from '../theme/button-social.css';
import { ButtonProps } from './button';
import cn from 'classnames';

// required FontAwesome Icons for Brands
import '../../public/fontawesome.min.css';
import '../../public/fa-brands.min.css';
import '../../public/fa-solid.min.css';

type buttonSocialStyle = ButtonSocialStyle & {};

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
}: ButtonSocialProps) => {
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
