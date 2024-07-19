import { OryDefaultComponents } from "../../themes/default"
import { OryFlowComponents } from "../../types"

export function mergeComponents(
  contextComponents: Partial<OryFlowComponents> | undefined,
  flowComponents: Partial<OryFlowComponents> | undefined,
): OryFlowComponents {
  return {
    ...OryDefaultComponents,
    ...contextComponents,
    ...flowComponents,
  }
}
