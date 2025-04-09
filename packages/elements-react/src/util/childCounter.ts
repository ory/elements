import { Children, ReactNode, isValidElement } from "react"

export function countRenderableChildren(children: ReactNode | ReactNode[]) {
  return Children.toArray(children).filter((c) => {
    if (isValidElement(c)) {
      return true
    }
    return false
  }).length
}
