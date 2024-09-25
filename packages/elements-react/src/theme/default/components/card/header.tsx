import { FlowType, isUiNodeInputAttributes } from "@ory/client-fetch"
import { FlowContainer, useComponents, useOryFlow } from "@ory/elements-react"

function joinWithCommaOr(list: string[]): string {
  if (list.length === 0) {
    return "."
  } else if (list.length === 1) {
    return list[0] + "."
  } else {
    const last = list.pop()
    return `${list.join(", ")} or ${last}.`
  }
}

function constructCardHeaderText(container: FlowContainer) {
  const parts = []
  const ui = container.flow.ui

  if (ui.nodes.find((node) => node.group === "password")) {
    switch (container.flowType) {
      case FlowType.Registration:
        parts.push(`your email and a password`)
        break
      default:
        parts.push(`your email and password`)
    }
  }
  if (ui.nodes.find((node) => node.group === "oidc")) {
    parts.push(`a social provider`)
  }

  if (ui.nodes.find((node) => node.group === "code")) {
    parts.push(`a code sent to your email`)
  }

  // TODO - PassKeys
  if (ui.nodes.find((node) => node.group === "passkey")) {
    parts.push(`a PassKey`)
  }

  if (ui.nodes.find((node) => node.group === "webauthn")) {
    parts.push(`a security key`)
  }

  if (ui.nodes.find((node) => node.group === "default")) {
    const primaryIdentifier = ui.nodes.filter(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("traits"),
    )
    if (primaryIdentifier.length == 1) {
      const label = primaryIdentifier[0].meta.label
      if (label) {
        parts.push(`your ${label.text}`)
      }
    }
  }

  if (ui.nodes.find((node) => node.group === "identifier_first")) {
    const identifier = ui.nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith("identifier") &&
        node.attributes.type !== "hidden",
    )

    if (identifier) {
      parts.push(`your ${identifier.meta.label?.text}`)
    }
  }

  switch (container.flowType) {
    case FlowType.Login:
      if (container.flow.refresh) {
        return {
          title: "Reauthenticate",
          description: "Confirm your identity with " + joinWithCommaOr(parts),
        }
      }
      return {
        title: "Sign in",
        description:
          parts.length > 0 ? "Sign in with " + joinWithCommaOr(parts) : "",
      }
    case FlowType.Registration:
      return {
        title: "Sign up",
        description:
          parts.length > 0 ? "Sign up with " + joinWithCommaOr(parts) : "",
      }
    case FlowType.Recovery:
      return {
        title: "Recover your account",
        description:
          "Enter the email address associated with your account to receive a one-time access code",
      }
    case FlowType.Settings:
      return {
        title: "Update your account",
      }
    case FlowType.Verification:
      return {
        title: "Verify your account",
        description:
          "Enter the email address associated with your account to verify it",
      }
  }
}

function InnerCardHeader({ title, text }: { title: string; text?: string }) {
  const { CardLogo } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <CardLogo />
      <div>
        <h2 className="font-semibold text-lg text-dialog-fg-default leading-normal">
          {title}
        </h2>
        <p className="text-sm leading-normal text-dialog-fg-subtle">{text}</p>
      </div>
    </header>
  )
}

export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description } = constructCardHeaderText(context)

  return <InnerCardHeader title={title} text={description} />
}
