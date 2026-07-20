// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineComponent, h } from "vue"

export const ArrowLeft = defineComponent({
  name: "ArrowLeft",
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
          viewBox: "0 0 24 25",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          width: props.size,
          height: props.size,
        },
        [
          h("path", {
            d: "M5 12.3253H19M5 12.3253L11 18.3253M5 12.3253L11 6.32529",
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
          }),
        ],
      )
  },
})
