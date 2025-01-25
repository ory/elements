import { CustomThemeConfig } from "tailwindcss/types/config"
import variables from "./generated/variables-processed.json"

export default {
  colors: {
    ...variables.colors.light,
    ...variables.colors.brand,
    ...variables.colors.primitives,
  },
  backgroundColor: {
    ...variables.colors.light,
    ...variables.colors.brand,
    ...variables.colors.primitives,
  },
  borderColor: {
    ...variables.colors.light,
    ...variables.colors.brand,
    ...variables.colors.primitives,
  },
  ringColor: {
    ...variables.colors.light,
    ...variables.colors.brand,
    ...variables.colors.primitives,
  },
  fill: {
    ...variables.colors.light,
    ...variables.colors.brand,
    ...variables.colors.primitives,
  },
  borderRadius: variables.borderRadius,
} satisfies Partial<CustomThemeConfig>
