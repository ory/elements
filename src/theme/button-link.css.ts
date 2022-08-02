import {
    oryTheme,
} from "./theme.css";

import { pxToRem } from "../utils";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const buttonLinkStyle = recipe({
    base: {
        cursor: "pointer",
        color: oryTheme.accent.default,
        ":disabled": {
            color: oryTheme.foreground.disabled
        },
        ":hover": {
            color: oryTheme.accent.muted
        },
        ":active": {
            color: oryTheme.accent.emphasis
        },
        ":focus": {
            color: oryTheme.accent.muted
        }
    }
})