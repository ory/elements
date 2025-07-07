// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { default as en } from "./en.json"
import { default as de } from "./de.json"
import { default as es } from "./es.json"
import { default as fr } from "./fr.json"
import { default as nl } from "./nl.json"
import { default as pl } from "./pl.json"
import { default as pt } from "./pt.json"
import { default as sv } from "./sv.json"
import { default as no } from "./no.json"

// export type TranslationFile = {
//   [K in keyof typeof en]: string
// }

// TODO: we can probably provide typesafety here, since we know all keys.
// However, tsup dts doesn't seem to generate proper dts files if we reference a JSON imported file in the type here.
// A potential workaround is to have some code generation tool, that runs after the message extraction and produces a dts file containing all known keys.
export type LocaleMap = Record<string, Record<string, string>>

export const OryLocales: LocaleMap = {
  en,
  de,
  es,
  fr,
  nl,
  pl,
  pt,
  sv,
  no,
}
