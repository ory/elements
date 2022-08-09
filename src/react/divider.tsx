import { dividerStyle } from '../theme';
import cn from 'classnames';

export interface DividerProps extends React.HTMLProps<HTMLHRElement> {
  fullWidth?: boolean;
  className?: string;
}

export const Divider = ({ className, fullWidth }: DividerProps) => (
  <hr
    className={cn(
      dividerStyle(fullWidth ? { sizes: 'fullWidth' } : {}),
      className
    )}
  />
);
