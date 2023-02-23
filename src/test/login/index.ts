import { expect } from "@playwright/test"
import { LoginPage } from "../models/LoginPage"

export const LoginSuccessTest = async (loginPage: LoginPage) => {
  const createRequest = loginPage.interceptCreateRequest()
  await loginPage.goto()

  const createResponse = await createRequest

  await expect(createResponse.status).toBe(200)

  await loginPage.expectTraitFields()

  const fetchRequest = loginPage.interceptFetchRequest()
  await loginPage.page.reload()

  const fetchResponse = await fetchRequest
  await expect(fetchResponse.status).toBe(200)

  const submitRequest = loginPage.interceptSubmitRequest()
  await loginPage.submitForm()

  const submitResponse = await submitRequest
  await expect(submitResponse.status).toBe(200)
}

export const LoginErrorTest = async (loginPage: LoginPage) => {
  const createRequest = loginPage.interceptCreateRequest()
  await loginPage.goto()

  const createResponse = await createRequest

  await expect(createResponse.status).toBe(200)

  await loginPage.expectTraitFields()

  const fetchRequest = loginPage.interceptFetchRequest()
  await loginPage.page.reload()

  const fetchResponse = await fetchRequest
  await expect(fetchResponse.status).toBe(200)

  const submitRequest = loginPage.interceptSubmitRequest()
  await loginPage.submitForm()

  const submitResponse = await submitRequest
  await expect(submitResponse.status).toBe(400)
}
