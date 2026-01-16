import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"
import { useComponents, useOryFlow } from "../../../../context"
import { OryNodeButtonButtonProps } from "../../../../types"
import { triggerToWindowCall } from "../../../../util/ui"
import { UiNodeInput } from "../../../../util/utilFixSDKTypesHelper"

type ButtonRendererProps = {
  node: UiNodeInput
}

export function ButtonRenderer({ node }: ButtonRendererProps) {
  const { Node } = useComponents()
  const { formState, setValue } = useFormContext()
  const {
    formState: { isSubmitting },
  } = useOryFlow()
  const [clicked, setClicked] = useDebounceValue(false, 100)

  const handleClick = useCallback(() => {
    setValue(node.attributes.name, node.attributes.value)
    setClicked(true)
    if (node.attributes.onclickTrigger) {
      triggerToWindowCall(node.attributes.onclickTrigger)
    }
  }, [node.attributes, setValue, setClicked])

  const buttonProps = {
    type: node.attributes.type === "submit" ? "submit" : "button",
    name: node.attributes.name,
    value: node.attributes.value,
    onClick: handleClick,
    disabled: node.attributes.disabled || !formState.isReady || isSubmitting,
  } satisfies OryNodeButtonButtonProps

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  return (
    <Node.Button
      attributes={node.attributes}
      node={node}
      buttonProps={buttonProps}
      isSubmitting={clicked}
    />
  )
}

/**
 * Renders the component passed for button nodes.
 *
 * @param props - The properties of the button node to render.
 * @returns A React element representing the button node.
 */
export type ButtonRenderer = typeof ButtonRenderer
