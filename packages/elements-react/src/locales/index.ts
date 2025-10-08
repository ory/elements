// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { default as af } from "./af.json"
import { default as ak } from "./ak.json"
import { default as am } from "./am.json"
import { default as ar } from "./ar.json"
import { default as as } from "./as.json"
import { default as az } from "./az.json"
import { default as be } from "./be.json"
import { default as bg } from "./bg.json"
import { default as bm } from "./bm.json"
import { default as bn } from "./bn.json"
import { default as ca } from "./ca.json"
import { default as cs } from "./cs.json"
import { default as da } from "./da.json"
import { default as de } from "./de.json"
import { default as el } from "./el.json"
import { default as en } from "./en.json"
import { default as es } from "./es.json"
import { default as et } from "./et.json"
import { default as fa } from "./fa.json"
import { default as fi } from "./fi.json"
import { default as fr } from "./fr.json"
import { default as gu } from "./gu.json"
import { default as ha } from "./ha.json"
import { default as he } from "./he.json"
import { default as hi } from "./hi.json"
import { default as hr } from "./hr.json"
import { default as hu } from "./hu.json"
import { default as hy } from "./hy.json"
import { default as id } from "./id.json"
import { default as ig } from "./ig.json"
import { default as it } from "./it.json"
import { default as ja } from "./ja.json"
import { default as ka } from "./ka.json"
import { default as kk } from "./kk.json"
import { default as km } from "./km.json"
import { default as kn } from "./kn.json"
import { default as ko } from "./ko.json"
import { default as ku } from "./ku.json"
import { default as ky } from "./ky.json"
import { default as lt } from "./lt.json"
import { default as lv } from "./lv.json"
import { default as mk } from "./mk.json"
import { default as ml } from "./ml.json"
import { default as mn } from "./mn.json"
import { default as mr } from "./mr.json"
import { default as ms } from "./ms.json"
import { default as my } from "./my.json"
import { default as ne } from "./ne.json"
import { default as nl } from "./nl.json"
import { default as no } from "./no.json"
import { default as or } from "./or.json"
import { default as pa } from "./pa.json"
import { default as pl } from "./pl.json"
import { default as ps } from "./ps.json"
import { default as pt } from "./pt.json"
import { default as ro } from "./ro.json"
import { default as ru } from "./ru.json"
import { default as sd } from "./sd.json"
import { default as si } from "./si.json"
import { default as sk } from "./sk.json"
import { default as sl } from "./sl.json"
import { default as so } from "./so.json"
import { default as sq } from "./sq.json"
import { default as sr } from "./sr.json"
import { default as su } from "./su.json"
import { default as sv } from "./sv.json"
import { default as sw } from "./sw.json"
import { default as ta } from "./ta.json"
import { default as te } from "./te.json"
import { default as tg } from "./tg.json"
import { default as th } from "./th.json"
import { default as tk } from "./tk.json"
import { default as tl } from "./tl.json"
import { default as tr } from "./tr.json"
import { default as ug } from "./ug.json"
import { default as uk } from "./uk.json"
import { default as ur } from "./ur.json"
import { default as uz } from "./uz.json"
import { default as vi } from "./vi.json"
import { default as xh } from "./xh.json"
import { default as yo } from "./yo.json"
import { default as zh } from "./zh.json"
import { default as zu } from "./zu.json"

// export type TranslationFile = {
//   [K in keyof typeof en]: string
// }

// TODO: we can probably provide typesafety here, since we know all keys.
// However, tsup dts doesn't seem to generate proper dts files if we reference a JSON imported file in the type here.
// A potential workaround is to have some code generation tool, that runs after the message extraction and produces a dts file containing all known keys.
export type LocaleMap = Record<string, Record<string, string>>

export const OryLocales: LocaleMap = {
  af,
  ak,
  am,
  ar,
  as,
  az,
  be,
  bg,
  bm,
  bn,
  ca,
  cs,
  da,
  de,
  el,
  en,
  es,
  et,
  fa,
  fi,
  fr,
  gu,
  ha,
  he,
  hi,
  hr,
  hu,
  hy,
  id,
  ig,
  it,
  ja,
  ka,
  kk,
  km,
  kn,
  ko,
  ku,
  ky,
  lt,
  lv,
  mk,
  ml,
  mn,
  mr,
  ms,
  my,
  ne,
  nl,
  no,
  or,
  pa,
  pl,
  ps,
  pt,
  ro,
  ru,
  sd,
  si,
  sk,
  sl,
  so,
  sq,
  sr,
  su,
  sv,
  sw,
  ta,
  te,
  tg,
  th,
  tk,
  tl,
  tr,
  ug,
  uk,
  ur,
  uz,
  vi,
  xh,
  yo,
  zh,
  zu,
}
