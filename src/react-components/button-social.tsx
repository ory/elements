import React from 'react';
import {
  buttonSocialIconStyle,
  buttonSocialStyle,
  buttonSocialTitleStyle
} from '../theme/button-social.css';
import cn from 'classnames';

// required FontAwesome Icons for Brands
import '../../public/fontawesome.min.css';
import '../../public/fa-brands.min.css';
import '../../public/fa-solid.min.css';

import { ButtonSocialProps } from '../component-types';

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
