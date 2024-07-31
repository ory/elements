// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from "@playwright/experimental-ct-react"
import { nodes } from "./fixtures/nodes"
import { getNodeLabel } from "../ui"

test("getNodeLabel", () => {
  expect(JSON.stringify(nodes.map(getNodeLabel), null, 2)).toMatchSnapshot(
    "getNodeLabel.json",
  )
})
