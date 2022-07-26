import {dividerStyle} from "../theme";

export type DividerProps = {
  className?: string
}

export const Divider = ({className}:DividerProps) => <div className={`${dividerStyle()} ${className ? className : ''}`}/>;
