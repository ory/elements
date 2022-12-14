// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { assignInlineVars } from "@vanilla-extract/dynamic"
import express, { Application, Request, Response } from "express"
import { merge } from "lodash"
import { oryTheme, Theme } from "../theme"

type CreateHelpers = (
  req: Request,
  res: Response,
) => {
  theme?: Theme
}

type OryEelementsExpressRoute = (
  app: Application,
  defaultTheme: Theme,
  createHelpers: CreateHelpers,
) => void

export const RegisterOryElementsExpress: OryEelementsExpressRoute = (
  app: Application,
  defaultTheme: Theme,
  createHelpers: CreateHelpers,
) => {
  app.use("/theme.css", (req: Request, res: Response) => {
    const { theme } = createHelpers(req, res)
    res.header("Content-Type", "text/css")
    res.send(
      `body {${assignInlineVars(
        oryTheme,
        merge({}, defaultTheme, theme || {}),
      ).toString()}}`,
    )
  })
  app.use("/", express.static("node_modules/@ory/elements/dist"))
}
