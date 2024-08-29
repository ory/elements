// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  plugins: [
    require("tailwindcss")(),
    require("autoprefixer")(),
    require("postcss-prefix-selector")({ prefix: ".ory-elements-react" }),
  ],
}
