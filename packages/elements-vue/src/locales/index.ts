// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import af from "./af.json"
import ak from "./ak.json"
import am from "./am.json"
import ar from "./ar.json"
import as_ from "./as.json"
import az from "./az.json"
import be from "./be.json"
import bg from "./bg.json"
import bm from "./bm.json"
import bn from "./bn.json"
import ca from "./ca.json"
import cs from "./cs.json"
import da from "./da.json"
import de from "./de.json"
import el from "./el.json"
import en from "./en.json"
import es from "./es.json"
import et from "./et.json"
import fa from "./fa.json"
import fi from "./fi.json"
import fr from "./fr.json"
import gu from "./gu.json"
import ha from "./ha.json"
import he from "./he.json"
import hi from "./hi.json"
import hr from "./hr.json"
import hu from "./hu.json"
import hy from "./hy.json"
import id from "./id.json"
import ig from "./ig.json"
import it from "./it.json"
import ja from "./ja.json"
import ka from "./ka.json"
import kk from "./kk.json"
import km from "./km.json"
import kn from "./kn.json"
import ko from "./ko.json"
import ku from "./ku.json"
import ky from "./ky.json"
import lt from "./lt.json"
import lv from "./lv.json"
import mk from "./mk.json"
import ml from "./ml.json"
import mn from "./mn.json"
import mr from "./mr.json"
import ms from "./ms.json"
import my from "./my.json"
import ne from "./ne.json"
import nl from "./nl.json"
import no from "./no.json"
import or_ from "./or.json"
import pa from "./pa.json"
import pl from "./pl.json"
import ps from "./ps.json"
import pt from "./pt.json"
import ro from "./ro.json"
import ru from "./ru.json"
import sd from "./sd.json"
import si from "./si.json"
import sk from "./sk.json"
import sl from "./sl.json"
import so from "./so.json"
import sq from "./sq.json"
import sr from "./sr.json"
import su from "./su.json"
import sv from "./sv.json"
import sw from "./sw.json"
import ta from "./ta.json"
import te from "./te.json"
import tg from "./tg.json"
import th from "./th.json"
import tk from "./tk.json"
import tl from "./tl.json"
import tr from "./tr.json"
import ug from "./ug.json"
import uk from "./uk.json"
import ur from "./ur.json"
import uz from "./uz.json"
import vi from "./vi.json"
import xh from "./xh.json"
import yo from "./yo.json"
import zh from "./zh.json"
import zu from "./zu.json"

export type LocaleMap = Record<string, Record<string, string>>

export const OryLocales: LocaleMap = Object.freeze({
  af,
  ak,
  am,
  ar,
  as: as_,
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
  or: or_,
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
})

export type Locale = keyof typeof OryLocales
