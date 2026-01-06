// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineComponent, h } from "vue"

export const IconPassword = defineComponent({
  name: "IconPassword",
  props: {
    size: {
      type: Number,
      default: 24,
    },
  },
  setup(props) {
    return () =>
      h(
        "svg",
        {
          viewBox: "0 0 14 4",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          width: props.size,
          height: props.size,
        },
        [
          h("path", {
            d: "M7 0.666992V3.33366M5.66667 2.66699L8.33333 1.33366M5.66667 1.33366L8.33333 2.66699M2.33333 0.666992V3.33366M1 2.66699L3.66667 1.33366M1 1.33366L3.66667 2.66699M11.6667 0.666992V3.33366M10.3333 2.66699L13 1.33366M10.3333 1.33366L13 2.66699",
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      )
  },
})
