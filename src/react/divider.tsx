import { dividerStyle } from '../theme';
import cn from 'classnames';

export type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => (
  <hr className={cn(dividerStyle(), className)} />
);
