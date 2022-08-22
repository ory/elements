export const pxToRem = (...px: number[]) =>
  px.map((x) => `${x / 16}rem`).join(" ")

export const pxToEm = (...px: number[]) =>
  px.map((x) => `${x / 16}em`).join(" ")
