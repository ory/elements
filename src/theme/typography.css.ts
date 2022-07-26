import {recipe} from "@vanilla-extract/recipes";
import {pxToRem} from "../utils";

export const inputTypographyStyle = recipe({
  base: {
    fontFamily: 'Inter',
    textDecoration: 'none'
  },
  
  defaultVariants: {
    size: 16,
    type: 'regular'
  },
  
  variants: {
    size: {
      16: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(24),
      },
      18: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
      }
    },
    type: {
      regular: {
        fontWeight: 400,
        fontStyle: 'normal',
      },
      semiBold: {}
    }
  }
})

export const buttonTypographyStyle = recipe({
  base: {
    fontFamily: 'Inter',
    textDecoration: 'none'
  },
  
  defaultVariants: {
    size: 16,
    type: 'regular'
  },
  
  variants: {
    size: {
      14: {
        fontSize: pxToRem(14),
        lineHeight: pxToRem(20),
      },
      16: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(28),
      },
      18: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
      }
    },
    type: {
      regular: {
        fontWeight: 400,
        fontStyle: 'normal',
      },
      semiBold: {}
    }
  }
})

export const typographyStyle = recipe({
  base: {
    fontFamily: 'Inter',
    textDecoration: 'none'
  },
  
  defaultVariants: {
    type: 'regular',
  },
  
  variants: {
    size: {
      tiny: {
        fontSize: pxToRem(10),
        lineHeight: pxToRem(16)
      },
      xsmall: {
        fontSize: pxToRem(12),
        lineHeight: pxToRem(20)
      },
      small: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(28),
      },
      body: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
      },
      lead: {
        fontSize: pxToRem(24),
        lineHeight: pxToRem(36),
      },
      headline21: {
        fontSize: pxToRem(21),
        lineHeight: pxToRem(32),
      },
      headline26: {
        fontSize: pxToRem(26),
        lineHeight: pxToRem(40),
      },
      headline31: {
        fontSize: pxToRem(31),
        lineHeight: pxToRem(48),
      },
      headline37: {
        fontSize: pxToRem(37),
        lineHeight: pxToRem(52),
      },
      headline48: {
        fontSize: pxToRem(48),
        lineHeight: pxToRem(60),
      },
      display: {
        fontSize: pxToRem(64),
        lineHeight: pxToRem(80),
      },
      hero: {
        fontSize: pxToRem(80),
        lineHeight: pxToRem(96),
      },
      uber: {
        fontSize: pxToRem(112),
        lineHeight: pxToRem(120),
      },
      colossus: {
        fontSize: pxToRem(140),
        lineHeight: pxToRem(144)
      }
    },
    type: {
      regular: {
        fontWeight: 400,
        fontStyle: 'normal',
      },
      bold: {
        fontWeight: 700,
        fontStyle: 'normal'
      }
    }
  }
})
