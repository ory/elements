import {cardStyle, CardVariants} from "../theme";

export type CardProps = {
  children: string
  title: string
}  & CardVariants

export const CardBase = ({children, title, size}: CardProps) => {
  return `
  <div class=${cardStyle({size: size})}>
    <h2>${title}</h2>
    ${children}
  </div>
  `
}
