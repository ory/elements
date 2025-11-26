import { OryNodeSsoButtonProps } from "@ory/elements-react"
import { IconBrandGoogle, IconTopologyRing } from "@tabler/icons-react"

const Icons: Record<string, typeof IconBrandGoogle> = {
  google: IconBrandGoogle,
}

export function MyCustomSsoButton({
  node,
  buttonProps,
  provider,
  isSubmitting,
}: OryNodeSsoButtonProps) {
  console.log("Rendering MyCustomSsoButton for provider:", provider)
  const Icon = Icons[provider] || IconTopologyRing

  return (
    <button className="p-2 rounded-md bg-gray-100" {...buttonProps}>
      <span className="flex items-center gap-2 justify-center">
        {!isSubmitting ? (
          <>
            <Icon />
            {node.meta.label?.text}
          </>
        ) : (
          <span>Submitting...</span>
        )}
      </span>
    </button>
  )
}
