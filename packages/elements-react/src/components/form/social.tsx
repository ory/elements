import { useComponents } from "../../context"
import { useOryFlow } from "../../context"
import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryForm } from "./form"
import { useFormContext } from "react-hook-form"

export type HeadlessSocialButtonsProps = PropsWithChildren<{
  hideDivider?: boolean
}>

export type HeadlessSocialButtonContainerProps = PropsWithChildren<{
  nodes: UiNode[]
}>

export type HeadlessSocialButtonProps = PropsWithChildren<{
  node: UiNode
  attributes: UiNodeInputAttributes
  onClick?: () => void
}>

export function OryFormSocialButtons({
  children,
  hideDivider,
}: HeadlessSocialButtonsProps) {
  const {
    flow: { ui },
  } = useOryFlow()
  const { setValue } = useFormContext()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  const { SocialButtonContainer, HorizontalDivider, SocialButton } =
    useComponents()

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
            return (
              <SocialButton
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
