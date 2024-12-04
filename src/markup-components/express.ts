// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { assignInlineVars } from "@vanilla-extract/dynamic"
import express, { Request, Response, Router } from "express"
import { cloneDeep, merge } from "lodash"
import { oryTheme, Theme } from "../theme"

type CreateHelpers = (
  req: Request,
  res: Response,
) => {
  theme?: Theme
}

type OryEelementsExpressRoute = (
  app: Router,
  defaultTheme: Theme,
  createHelpers: CreateHelpers,
) => void

export const RegisterOryElementsExpress: OryEelementsExpressRoute = (
  app: Router,
  defaultTheme: Theme,
  createHelpers: CreateHelpers,
) => {
  app.use("/theme.css", (req: Request, res: Response) => {
    const { theme } = createHelpers(req, res)
    res.header("Content-Type", "text/css")
    let inlineTheme = cloneDeep(defaultTheme) // we don't want to pollute the default theme
    if (theme) {
      // merge with the default theme to make sure all variables are present
      // this includes nested keys like `accent.def`
      // merge also creates a new object ensuring that we don't pollute the default or request theme
      inlineTheme = merge({}, inlineTheme, theme)
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string -- false positive?
    res.send(`body {${assignInlineVars(oryTheme, inlineTheme).toString()}}`)
  })
  app.use("/", express.static("node_modules/@ory/elements/dist"))
}
