import { HeadlessButtonProps } from "@ory/react-headless"

export function DefaultCurrentIdentifierButton({
  attributes,
}: HeadlessButtonProps) {
  return (
    <div>
      <span className="py-1 px-3 rounded-full border border-button-identifier-border-default bg-button-identifier-bg-default">
        <span className="text-sm font-medium leading-none">
          {attributes.value}
        </span>
      </span>
    </div>
  )
}
