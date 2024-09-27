import { HeadlessCurrentIdentifierProps } from "@ory/elements-react"
import IconArrowLeft from "../../assets/icons/arrow-left.svg"

export function DefaultCurrentIdentifierButton({
  attributes,
  onClick,
  type,
  href,
}: HeadlessCurrentIdentifierProps) {
  const Element = onClick ? "button" : "a"

  return (
    <div>
      <Element
        className="cursor-pointer py-1.5 px-3 rounded-full border border-button-identifier-border-default bg-button-identifier-bg-default hover:border-button-identifier-border-hover hover:bg-button-identifier-bg-hover transition-colors inline-flex gap-1 items-center"
        onClick={onClick}
        {...attributes}
        href={href}
        type={type}
      >
        <IconArrowLeft size={16} className="text-button-identifier-fg-subtle" />
        <span className="text-sm font-medium leading-none  text-button-identifier-fg-default">
          {attributes.value}
        </span>
      </Element>
    </div>
  )
}
