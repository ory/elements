import { UiText } from "@ory/client-fetch"

export function messageTestId(message: UiText) {
  return {
    "data-testid": `ory-message-${message.id}`,
  }
}

export function formElementId(attributes: { name: string }) {
  return {
    id: `ory-elements-form-${attributes.name}`,
  }
}

export function formLabelId(attributes: { name: string }) {
  return {
    htmlFor: `ory-elements-form-${attributes.name}`,
  }
}
