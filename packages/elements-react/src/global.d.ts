// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

declare module "*.svg" {
  import * as React from "react"

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { size?: number }
  >

  export default ReactComponent
}
