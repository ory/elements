export const pxToRem = (...px: number[]) =>
  px.map((x) => `${x / 16}rem`).join(' ');
