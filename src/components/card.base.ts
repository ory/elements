import {CardStyle, cardStyle} from "../theme";
import {Children} from "./types";


export type CardProps = {
  children?: Children;
  title: string
} & CardStyle

export const CardBase = ({children, title, theme}: CardProps) => {
  return `
  <div class="${cardStyle({theme: theme})}">
    <h2>${title}</h2>
    ${children || ''}
  </div>
  `
}
