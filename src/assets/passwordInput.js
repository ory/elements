// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

document.getElementsByName("password").forEach((p) => {
  if (
    p.type === "password" &&
    !!(p.offsetWidth || p.offsetHeight || p.getClientRects().length)
  ) {
    document.getElementsByName("password").forEach((y) => {
      if (y.type === "text") {
        y.remove()
      }
    })
  } else if (p.type === "password") {
    p.remove()
  }
})
