// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Theme } from "../../theme"

declare module "express" {
  export interface Request {
    theme?: Theme
  }
}
