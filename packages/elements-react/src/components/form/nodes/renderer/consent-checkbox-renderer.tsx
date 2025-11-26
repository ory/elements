import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { useComponents } from "../../../../context"
import { OryNodeConsentScopeCheckboxProps } from "../../../../types"
import { UiNodeInput } from "../../../../util/utilFixSDKTypesHelper"

export function ConsentCheckboxRenderer({ node }: { node: UiNodeInput }) {
  const attributes = node.attributes
  const { Node } = useComponents()
  const { setValue, watch, formState } = useFormContext()
  const scopes = watch("grant_scope")
  const checked = useMemo(() => {
    if (Array.isArray(scopes)) {
      return scopes.includes(attributes.value as string)
    }
    return false
  }, [scopes, attributes.value])

  const handleScopeChange = (checked: boolean) => {
    const scopes = watch("grant_scope")
    if (Array.isArray(scopes)) {
      if (checked) {
        setValue(
          "grant_scope",
          Array.from(new Set([...scopes, attributes.value])),
        )
      } else {
        setValue(
          "grant_scope",
          scopes.filter((scope: string) => scope !== attributes.value),
        )
      }
    }
  }

  const inputProps = {
    value: attributes.value,
    checked: checked === true,
    disabled: attributes.disabled || !formState.isReady,
    name: attributes.name,
  } satisfies OryNodeConsentScopeCheckboxProps["inputProps"]

  return (
    <Node.ConsentScopeCheckbox
      attributes={attributes}
      node={node}
      inputProps={inputProps}
      onCheckedChange={handleScopeChange}
      // onClick={() => {}}
    />
  )
}
