// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// Import styles, initialize component theme here.
// import '../src/common.css';

// Import styles, initialize component theme here.
import { beforeMount } from "@playwright/experimental-ct-react/hooks"
import { OryComponentProvider } from "../src/context"
import { OryDefaultComponents } from "../src/theme/default"
import React from "react"

beforeMount(async ({ App }) => (
  <OryComponentProvider components={OryDefaultComponents}>
    <App />
  </OryComponentProvider>
))
