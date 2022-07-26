import {oryTheme} from "./theme.css";
import {pxToRem} from "../utils";
import {recipe} from "@vanilla-extract/recipes";

export const dividerStyle = recipe({
  base: {
    border: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.default,
    width: pxToRem(64),
  }
})
