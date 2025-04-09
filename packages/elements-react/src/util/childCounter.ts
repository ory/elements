// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Children, ReactNode, isValidElement } from "react"

export function countRenderableChildren(children: ReactNode | ReactNode[]) {
  return Children.toArray(children).filter((c) => {
    if (isValidElement(c)) {
      return true
    }
    return false
  }).length
}
