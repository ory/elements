// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

declare module "*.svg" {
  import { SVGIcon } from "./types"

  const ReactComponent: SVGIcon

  export default ReactComponent
}
