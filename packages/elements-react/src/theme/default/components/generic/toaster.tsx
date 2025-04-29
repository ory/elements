import { ComponentType, useEffect } from "react"
import { Toaster as SonnerToaster } from "sonner"
import { toast } from "../../utils/toast"
import { OryToastProps, useOryFlow } from "@ory/elements-react"

type ToasterProps = {
  components: {
    Toast: ComponentType<OryToastProps>
  }
  title: string
}

export function Toaster(props: ToasterProps) {
  const { flow } = useOryFlow()
  useEffect(() => {
    if (flow?.ui?.messages) {
      flow.ui.messages.forEach((message) => {
        toast(props.title, message, props.components)
      })
    }
  }, [flow?.ui?.messages, props])

  return <SonnerToaster />
}
