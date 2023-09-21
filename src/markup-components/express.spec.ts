// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/experimental-ct-react"
import express from "express"
import { RegisterOryElementsExpress } from "./express"

test("express ory elements routes", async ({ request }) => {
  const app = express()
  const theme = {
    fontFamily: "",
    fontFamilyMono: "",
    fontStyle: "",
    accent: {
      def: "#3D53F5",
      muted: "#6475F7",
      emphasis: "#3142C4",
      disabled: "#E0E0E0",
      subtle: "#eceefe",
    },
    foreground: {
      def: "#171717",
      muted: "#616161",
      subtle: "#9E9E9E",
      disabled: "#BDBDBD",
      onDark: "#FFFFFF",
      onAccent: "#FFFFFF",
      onDisabled: "#e0e0e0",
    },
    background: {
      surface: "#FFFFFF",
      canvas: "#FCFCFC",
      subtle: "#EEEEEE",
    },
    error: {
      def: "#9c0f2e",
      subtle: "#fce8ec",
      muted: "#e95c7b",
      emphasis: "#DF1642",
    },
    success: {
      emphasis: "#18A957",
    },
    border: {
      def: "#EEEEEE",
    },
    text: {
      def: "#FFFFFF",
      disabled: "#757575",
    },
    input: {
      background: "#FFFFFF",
      disabled: "#E0E0E0",
      placeholder: "#9E9E9E",
      text: "#424242",
    },
  }

  RegisterOryElementsExpress(app, theme, () => ({
    theme: theme,
  }))

  const server = app.listen()

  const address = server.address()

  await request
    .get(`${address?.toString()}/theme.css`)
    .then(({ body, status, headersArray }) => {
      expect(status()).toEqual(200)
      expect(headersArray()).toEqual([{ "Content-Type": "text/css" }])
      expect(body).toMatchSnapshot()
      server.closeAllConnections()
    })
})
