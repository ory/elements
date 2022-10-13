import { assignInlineVars } from "@vanilla-extract/dynamic"
import express from "express"
import { oryTheme, Theme } from "../theme"

export const RegisterOryElementsExpress = (
  app: express.Application,
  theme: Theme,
) => {
  app.use("/theme.css", (req, res) => {
    res.header("Content-Type", "text/css")
    res.send(
      `body {${assignInlineVars(oryTheme, {
        ...oryTheme,
        ...theme,
      }).toString()}}`,
    )
  })
  app.use("/", express.static("node_modules/@ory/elements-markup/dist"))
}
