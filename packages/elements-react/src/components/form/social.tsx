import { useComponents } from "../../context"
import { useOryFlow } from "../../context"
import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryForm } from "./form"
import { useFormContext } from "react-hook-form"

export type OryFormOidcButtonsProps = PropsWithChildren<{
  hideDivider?: boolean
}>

export type OryFormOidcRootProps = PropsWithChildren<{
  nodes: UiNode[]
}>

export type OryNodeOidcButtonProps = {
  node: UiNode
  attributes: UiNodeInputAttributes
  onClick?: () => void
}

export function OryFormOidcButtons({
  children,
  hideDivider,
}: OryFormOidcButtonsProps) {
  const {
    flow: { ui },
  } = useOryFlow()
  const { setValue } = useFormContext()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  const { Form, Card, Node } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  // Are there other first-factor nodes available?
  const otherNodes = ui.nodes.filter(
    (node) => node.group !== "oidc" && node.group !== "default",
  )

  return (
    <>
      <Form.OidcRoot nodes={filteredNodes}>
        {children ??
          filteredNodes.map((node, k) => {
            return (
              <Node.OidcButton
                node={node}
                key={k}
                attributes={node.attributes as UiNodeInputAttributes}
                onClick={() => {
                  setValue(
                    "provider",
                    (node.attributes as UiNodeInputAttributes).value,
                  )
                  setValue("method", "oidc")
                }}
              />
            )
          })}
      </Form.OidcRoot>
      {!hideDivider && filteredNodes.length > 0 && otherNodes.length > 0 && (
        <Card.Divider />
      )}
    </>
  )
}

export function OryFormSocialButtonsForm() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <OryForm>
      <OryFormOidcButtons />
    </OryForm>
  )
}
