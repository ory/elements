// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { assignInlineVars } from "@vanilla-extract/dynamic"
import express, { Application, Request, Response } from "express"
import { oryTheme, Theme } from "../theme"

export const RegisterOryElementsExpress = (
  app: Application,
  defaultTheme: Theme,
) => {
  app.use("/theme.css", (req: Request, res: Response) => {
    res.header("Content-Type", "text/css")
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...defaultTheme,
        ...(req.theme && req.theme),
      }).toString()}}`,
    )
  })
  app.use("/", express.static("node_modules/@ory/elements/dist"))
}
