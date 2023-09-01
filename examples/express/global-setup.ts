// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { spawn } from "child_process"
import path from "path"
import { RemoteHttpResolver } from "@mswjs/interceptors/RemoteHttpInterceptor"

const globlSetup = async () => {
  process.env.APPLICATION_URL =
    process.env.APPLICATION_URL || "http://localhost:3200"

  process.env.ORY_PROJECT_URL =
    process.env.ORY_PROJECT_URL || "http://localhost:4000"

  process.env.ORY_PROJECT_API_TOKEN = ""

  // const parentDirectory = path.join(__dirname, "../../")
  // console.log("using parent directory", parentDirectory)
  //
  // // set env var for express server
  // const nodemon = spawn("ts-node", ["./src/index.ts"], {
  //   cwd: __dirname,
  //   stdio: ["inherit", "inherit", "inherit", "ipc"],
  //   env: {
  //     ORY_SDK_URL: "http://localhost:4000",
  //     PORT: "3200",
  //     PATH: process.env.PATH,
  //     MOCK_SERVER: "true",
  //   },
  // })
  //
  // const resolver = new RemoteHttpResolver({
  //   process: nodemon,
  // })
  //
  // resolver.on('request', (req) => {
  //   console.log('request', req)
  // })
  //
  // nodemon.stdout?.on("data", (data) => {
  //   console.log(`stdout: ${data}`)
  // })
  //
  // nodemon.stderr?.on("data", (data) => {
  //   console.log(`stderr: ${data}`)
  // })
  //
  // nodemon.on("error", (err) => {
  //   console.error(`nodemon encountered an error ${err}`)
  // })
  //
  // nodemon.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`)
  // })
  //
  // let count = 10
  // while (count > 0) {
  //   try {
  //     const resp = await fetch("http://localhost:3200")
  //     if (resp.ok) {
  //       break
  //     }
  //   } catch (e) {
  //     console.log("Trying to connect to service ", e)
  //   }
  //   count--
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  // }
}

export default globlSetup
