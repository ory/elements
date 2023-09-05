// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { exec } from "node:child_process"

exec("npm run start", (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(stdout)
  console.log(stderr)
})

exec("npm run test", (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(stdout)
  console.log(stderr)
})
