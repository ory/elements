// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/experimental-ct-react"
import { Locator, Request } from "@playwright/test"
import { UserLogoutCard } from "./user-logout-card"

let component: Locator

test.beforeEach(async ({ mount }) => {
  component = await mount(
    <UserLogoutCard
      csrfToken="CSRF token"
      action="https://example.com/logout"
      challenge="logout challenge"
    />,
  )
})

async function submitForm(buttonText: RegExp): Promise<Request> {
  const requestPromise = component
    .page()
    .waitForRequest("https://example.com/logout")
  await component.locator("button", { hasText: buttonText }).click()
  return requestPromise
}

test("submits when user clicks 'Yes'", async () => {
  const request = await submitForm(/yes/i)

  expect(request.method()).toBe("POST")
  const data = request.postDataJSON() as unknown
  expect(data).toHaveProperty("_csrf", "CSRF token")
  expect(data).toHaveProperty("challenge", "logout challenge")
  expect(data).toHaveProperty("submit", "Yes")
})

test("submits when user clicks 'No'", async () => {
  const request = await submitForm(/no/i)

  expect(request.method()).toBe("POST")
  const data = request.postDataJSON() as unknown
  expect(data).toHaveProperty("_csrf", "CSRF token")
  expect(data).toHaveProperty("challenge", "logout challenge")
  expect(data).toHaveProperty("submit", "No")
})
