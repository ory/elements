// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { buildSlotMap, renderJson, renderMarkdown } from "./slot-map"

const agents = resolve(__dirname, "../agents")
const map = buildSlotMap()

writeFileSync(join(agents, "slots.json"), renderJson(map))
writeFileSync(join(agents, "slots.md"), renderMarkdown(map))
console.log(`Wrote ${map.slots.length} slots to ${agents}`)
