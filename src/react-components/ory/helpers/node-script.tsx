import { UiNode, UiNodeScriptAttributes } from "@ory/client"
import { filterNodesByGroups } from "@ory/integrations/ui"
import { HTMLAttributeReferrerPolicy, useEffect } from "react"

export const useScriptNodes = ({ nodes }: { nodes: UiNode[] }) => {
  useEffect(() => {
    const scriptNodes = filterNodesByGroups({
      nodes: nodes,
      groups: "webauthn",
      attributes: "text/javascript",
      withoutDefaultGroup: true,
      withoutDefaultAttributes: true,
    }).map((node) => {
      const attr = node.attributes as UiNodeScriptAttributes
      const script = document.createElement("script")
      script.setAttribute("data-testid", `node/script/${script.id}`)
      script.src = attr.src
      script.type = attr.type
      script.async = attr.async
      script.referrerPolicy = attr.referrerpolicy as HTMLAttributeReferrerPolicy
      script.crossOrigin = attr.crossorigin
      script.integrity = attr.integrity
      document.body.appendChild(script)
      return script
    })

    return () => {
      scriptNodes.forEach((script) => {
        document.body.removeChild(script)
      })
    }
  }, [nodes])
}
