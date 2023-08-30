// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { handlebarsHelpers } from "./pkg"
import { middleware as middlewareLogger } from "./pkg/logger"
import {
  register404Route,
  register500Route,
  registerConsentPostRoute,
  registerConsentRoute,
  registerErrorRoute,
  registerHealthRoute,
  registerLoginRoute,
  registerRecoveryRoute,
  registerRegistrationRoute,
  registerSessionsRoute,
  registerSettingsRoute,
  registerStaticRoutes,
  registerVerificationRoute,
  registerWelcomeRoute,
} from "./routes"
import { RemoteHttpInterceptor } from "@mswjs/interceptors/RemoteHttpInterceptor"
import cookieParser from "cookie-parser"
import express, { Request, Response } from "express"
import { engine } from "express-handlebars"
import * as fs from "fs"
import * as https from "https"

if (process.env.MOCK_SERVER === "true") {
  const interceptor = new RemoteHttpInterceptor()

  interceptor.apply()

  process.on("disconnect", () => {
    interceptor.dispose()
  })
}

const baseUrl = process.env.BASE_PATH || "/"

const app = express()
const router = express.Router()

app.use(middlewareLogger)
app.use(cookieParser())
app.set("view engine", "hbs")

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: `${__dirname}/../views/layouts/`,
    partialsDir: `${__dirname}/../views/partials/`,
    defaultLayout: "auth",
    helpers: handlebarsHelpers,
  }),
)

registerHealthRoute(router)
registerLoginRoute(router)
registerConsentRoute(app)
registerConsentPostRoute(app)
registerRecoveryRoute(router)
registerRegistrationRoute(router)
registerSettingsRoute(router)
registerVerificationRoute(router)
registerSessionsRoute(router)
registerWelcomeRoute(router)
registerErrorRoute(router)

router.get("/", (_: Request, res: Response) => {
  res.redirect(303, "welcome")
})

registerStaticRoutes(router)
register404Route(router)
register500Route(router)

app.use(baseUrl, router)

const port = Number(process.env.PORT) || 3000

const listener = (proto: "http" | "https") => () => {
  console.log(`Listening on ${proto}://0.0.0.0:${port}`)
}

if (process.env.TLS_CERT_PATH?.length && process.env.TLS_KEY_PATH?.length) {
  const options = {
    cert: fs.readFileSync(process.env.TLS_CERT_PATH),
    key: fs.readFileSync(process.env.TLS_KEY_PATH),
  }

  https.createServer(options, app).listen(port, listener("https"))
} else {
  app.listen(port, listener("http"))
}
