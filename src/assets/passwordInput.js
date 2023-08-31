// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

document.getElementsByName("password").forEach((p) => {
  const label = p.nextSibling
  if (label) {
    label.addEventListener("click", function () {
      if (p.type === "password") {
        p.type = "text"
      } else {
        p.type = "password"
      }
    })
  }
})
