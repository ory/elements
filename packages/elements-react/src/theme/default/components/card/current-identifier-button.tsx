import { HeadlessButtonProps } from "../../../../types"
import { DefaultInput } from "../form/input"

export function DefaultCurrentIdentifierButton({
  attributes,
  node,
}: HeadlessButtonProps) {
  return (
    <div>
      <span className="py-1 px-3 rounded-full border border-button-identifier-border-default bg-button-identifier-bg-default">
        <span className="text-sm font-medium leading-none">
          {attributes.value}
        </span>
      </span>
      <DefaultInput attributes={attributes} node={node} onClick={() => {}} />
    </div>
  )
}
