import { useComponents } from "../../context/component"
import { useOryFlow } from "../../context/flow-context"
import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { Node } from "./nodes/node"
import { OryForm } from "./form"

export type HeadlessSocialButtonsProps = PropsWithChildren<{
  hideDivider?: boolean
}>

export type HeadlessSocialButtonContainerProps = PropsWithChildren<{
  nodes: UiNode[]
}>

export type HeadlessSocialButtonProps = PropsWithChildren<{
  node: UiNode
  attributes: UiNodeInputAttributes
}>

export function OryFormSocialButtons({
  children,
  hideDivider,
}: HeadlessSocialButtonsProps) {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  const { SocialButtonContainer, HorizontalDivider } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  // Are there other first-factor nodes available?
  const otherNodes = ui.nodes.filter(
    (node) => node.group !== "oidc" && node.group !== "default",
  )

  return (
    <>
      <SocialButtonContainer nodes={filteredNodes}>
        {children ??
          filteredNodes.map((node, k) => {
            return <Node node={node} key={k} />
          })}
      </SocialButtonContainer>
      {!hideDivider && filteredNodes.length > 0 && otherNodes.length > 0 && (
        <HorizontalDivider />
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
      <OryFormSocialButtons />
    </OryForm>
  )
}
