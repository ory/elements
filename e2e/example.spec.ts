import { test, expect } from "@playwright/test"

const tc = [
  {
    name: "react-spa",
    url: "https://localhost:3000",
  },
]

for (const t of tc) {
  test("login" + t.name, async ({ page }) => {
    await page.goto(t.url)
    await page.fill("", "")
  })
}
