// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import fetch from "node-fetch"
import { writeFile } from "fs/promises"
import formatjs from "@formatjs/cli-lib"
import glob from "glob-promise"

type KratosMessage = {
  id: number
  text: string
  type: "info" | "error"
  context: Record<string, any>
}

type ExtendedMessageDocumentation = {
  [id: string]: {
    defaultMessage?: string
    description?: string
  }
}
;(async () => {
  const files = await glob("../src/**/*.{ts,tsx}").then((files) =>
    files.filter((f) => !f.endsWith(".d.ts")),
  )
  const extractedMessages = await formatjs.extract(files, {})

  const kratosMessages: ExtendedMessageDocumentation = await fetch(
    "https://raw.githubusercontent.com/ory/docs/master/docs/kratos/concepts/messages.json",
  )
    .then((res) => res.json())
    .then((messages) =>
      (messages as KratosMessage[]).map(({ id, text }) => [
        `kratos-messages.${id}`,
        { defaultMessage: text },
      ]),
    )
    .then(Object.fromEntries)

  await writeFile("../src/locales/formatjs.json", extractedMessages)
  await writeFile(
    "../src/locales/kratos-messages.json",
    JSON.stringify(kratosMessages, null, 2),
  )

  await formatjs.compileAndWrite(
    ["../src/locales/formatjs.json", "../src/locales/kratos-messages.json"],
    { outFile: "../src/locales/en.json" },
  )
})()
