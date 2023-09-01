// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
// Import styles, initialize component theme here.
// import '../src/common.css';
import { IntlProvider } from "../src/react-components"
import { beforeMount } from "@playwright/experimental-ct-react/hooks"

beforeMount(async ({ App, hooksConfig }) => (
  <IntlProvider>
    <App />
  </IntlProvider>
))
