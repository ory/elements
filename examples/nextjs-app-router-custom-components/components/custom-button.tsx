"use client"
import { getNodeLabel } from "@ory/client-fetch"
import { OryNodeButtonProps } from "@ory/elements-react"
import { useMemo } from "react"

export const MyCustomButton = ({
  node,
  buttonProps,
  isSubmitting,
}: OryNodeButtonProps) => {
  const label = getNodeLabel(node)

  const isPrimary = useMemo(() => {
    return (
      node.attributes.name === "method" ||
      node.attributes.name.includes("passkey") ||
      node.attributes.name.includes("webauthn") ||
      node.attributes.name.includes("lookup_secret") ||
      (node.attributes.name.includes("action") &&
        node.attributes.value === "accept")
    )
  }, [node.attributes.name, node.attributes.value])

  return (
    <button
      {...buttonProps}
      className={
        "bg-blue-500 text-white p-2 rounded-md " + (isPrimary && "bg-red-600")
      }
    >
      {isSubmitting ? (
        <span>Submitting...</span>
      ) : label ? (
        <span>{label.text}</span>
      ) : (
        ""
      )}
    </button>
  )
}
