import {recipe} from '@vanilla-extract/recipes';
import {theme} from "./theme.css";
import {pxToRem} from "../utils";

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    background: theme.palettes.light.background.surface,
    color: theme.palettes.light.foreground.def,
    width: '100%',
    padding: pxToRem(48),
  },
  variants: {
    wide: {
      width: pxToRem(432),
    }
  }
})
