// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { assignInlineVars } from "@vanilla-extract/dynamic"
import express, { Application } from "express"
import { oryTheme, Theme } from "../theme"

export const RegisterOryElementsExpress = (app: Application, theme: Theme) => {
  app.use("/theme.css", (req, res) => {
    res.header("Content-Type", "text/css")
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...oryTheme,
        ...theme,
      }).toString()}}`,
    )
  })
  app.use("/", express.static("node_modules/@ory/elements/dist"))
}
