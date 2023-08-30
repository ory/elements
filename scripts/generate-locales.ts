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

const kratosMessageOverrides: { [id: number]: (text: string) => string } = {
  1050014: (text) =>
    text.replace("2020-01-01 00:59:59 +0000 UTC", "{used_at, date, long}"),
  1060001: (text) =>
    text.replace("1.00", "{privileged_session_expires_at_unix_until_minutes}"),
  4010001: (text) => text.replace("1.00", "{expired_at_unix_since_minutes}"),
  4040001: (text) => text.replace("1.00", "{expired_at_unix_since_minutes}"),
  4050001: (text) => text.replace("1.00", "{expired_at_unix_since_minutes}"),
  4060005: (text) => text.replace("1.00", "{expired_at_unix_since_minutes}"),
  4070005: (text) => text.replace("1.00", "{expired_at_unix_since_minutes}"),
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
  Intl.DateTimeFormat().formatToParts(new Date("2020-01-01 00:59:59 +0000 UTC"))
  const extractedMessages = await formatjs.extract(files, {})
  await writeFile("../src/locales/formatjs.json", extractedMessages)

  const kratosMessages: ExtendedMessageDocumentation = await fetch(
    "https://raw.githubusercontent.com/ory/docs/master/docs/kratos/concepts/messages.json",
  )
    .then((res) => res.json())
    .then((messages) =>
      (messages as KratosMessage[]).map(({ id, text }) => [
        `identities.messages.${id}`,
        { defaultMessage: kratosMessageOverrides[id]?.(text) ?? text },
      ]),
    )
    .then(Object.fromEntries)

  await writeFile(
    "../src/locales/identities.messages.json",
    JSON.stringify(kratosMessages, null, 2),
  )

  await formatjs.compileAndWrite(
    ["../src/locales/formatjs.json", "../src/locales/identities.messages.json"],
    { outFile: "../src/locales/en.json" },
  )
})()
