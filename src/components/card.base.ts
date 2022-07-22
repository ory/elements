import {cardStyle, CardVariants} from "../theme";
import {Children} from "./types";


export type CardProps = {
  children?: Children;
  title: string
} & CardVariants

export const CardBase = ({children, title, size}: CardProps) => {
  return `
  <div class=${cardStyle({size: size})}>
    <h2>${title}</h2>
    ${children || ''}
  </div>
  `
}
