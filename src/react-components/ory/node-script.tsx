import { useEffect } from "react"
import { UiNode, UiNodeScriptAttributes } from "@ory/client"
import { HTMLAttributeReferrerPolicy } from "react"
import { filterNodesByGroups } from "@ory/integrations/ui"

export const useScriptNodes = ({ nodes }: { nodes: UiNode[] }) => {
  useEffect(() => {
    const scriptNodes = filterNodesByGroups({
      nodes: nodes,
      withoutDefaultGroup: true,
      withoutDefaultAttributes: true,
      groups: ["webauthn"],
      attributes: ["script"],
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
