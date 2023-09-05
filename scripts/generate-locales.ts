// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import formatjs from "@formatjs/cli-lib"
import { writeFile } from "fs/promises"
import glob from "glob-promise"
import fetch from "node-fetch"

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
  4000003: (text) =>
    text.replace("5", "{min_length}").replace("3", "{actual_length}"), // "length must be >= 5, but got 3",
  4000017: (text) =>
    text.replace("5", "{max_length}").replace("6", "{actual_length}"), // "length must be <= 5, but got 6",
  4000018: (text) => text.replace("5", "{minimum}").replace("3", "{actual}"), // "must be >= 5 but found 3",
  4000019: (text) => text.replace("5", "{minimum}").replace("5", "{actual}"), // "must be > 5 but found 5",
  4000020: (text) => text.replace("5", "{maximum}").replace("6", "{actual}"), // "must be <= 5 but found 6",
  4000021: (text) => text.replace("5", "{maximum}").replace("5", "{actual}"), // "must be < 5 but found 5",
  4000022: (text) => text.replace("3", "{actual}").replace("7", "{base}"), // "3 not multipleOf 7",
  4000023: (text) =>
    text.replace("3", "{max_items}").replace("4", "{actual_items}"), // "maximum 3 items allowed, but found 4 items",
  4000024: (text) =>
    text.replace("3", "{min_items}").replace("2", "{actual_items}"), // "minimum 3 items allowed, but found 2 items",
  4000025: (text) => text.replace("0", "{index_a}").replace("2", "{index_b}"), // "items at index 0 and 2 are equal",
  4000032: (text) =>
    text.replace("6", "{min_length}").replace("5", "{actual_length}"), // "The password must be at least 6 characters long, but got 5.",
  4000033: (text) =>
    text.replace("72", "{max_length}").replace("80", "{actual_length}"), // "The password must be at most 72 characters long, but got 80.",
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
