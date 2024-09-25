import { useComponents, useOryFlow } from "@ory/elements-react"
import { constructCardHeaderText } from "../../utils/constructCardHeader"

function InnerCardHeader({ title, text }: { title: string; text?: string }) {
  const { CardLogo } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <CardLogo />
      <div>
        <h2 className="font-semibold text-lg text-dialog-fg-default leading-normal">
          {title}
        </h2>
        <p className="text-sm leading-normal text-dialog-fg-subtle">{text}</p>
      </div>
    </header>
  )
}

export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description } = constructCardHeaderText(
    context.flow.ui.nodes,
    context,
  )

  return <InnerCardHeader title={title} text={description} />
}
