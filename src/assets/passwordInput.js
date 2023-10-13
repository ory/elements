// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const togglePassword = function (e) {
  if (e.type === "password") {
    e.type = "text"
  } else {
    e.type = "password"
  }
}

document.getElementsByName("password").forEach((p) => {
  const visibilityToggle = p.nextSibling
  if (visibilityToggle) {
    visibilityToggle.addEventListener("click", function () {
      togglePassword(p)
      visibilityToggle.dataset.checked =
        visibilityToggle.dataset.checked === "true" ? "false" : "true"
    })
    visibilityToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        togglePassword(p)
        visibilityToggle.dataset.checked =
          visibilityToggle.dataset.checked === "true" ? "false" : "true"
      }
    })
  }
})
