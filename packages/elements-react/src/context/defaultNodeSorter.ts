import { isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"

const defaultNodeOrder = [
  "oidc",
  "saml",
  "identifier_first",
  "default",
  "profile",
  "password",
  "captcha",
  "passkey",
  "code",
  "webauthn",
]

const Slot = {
  Inputs: 0,
  Checkboxes: 1,
  Captcha: 2,
  Buttons: 3,
}

function isUiNodeButton(node: UiNode) {
  return (
    isUiNodeInputAttributes(node.attributes) &&
    (node.attributes.type === "submit" || node.attributes.type === "button")
  )
}

// makeUiNodeComparator creates a comparator function for UiNodes based on the provided group order.
// It sorts the nodes first by slot (inputs, checkboxes, captchas, submits), then by group order, and finally by type within the same slot.
function makeUiNodeComparator({ groupOrder = defaultNodeOrder } = {}) {
  const groupRank = new Map(groupOrder.map((g, i) => [g, i]))
  const unknownGroupRank = groupOrder.length

  // Slot rank: 0 inputs, 1 checkboxes, 2 captchas, 3 submit/buttons
  const slotRank = (node: UiNode) => {
    if (isUiNodeInputAttributes(node.attributes) === false) {
      return Slot.Inputs // non-inputs go to default slot
    }
    const { type } = node.attributes

    // Keep webauthn inputs next to the webauthn button by treating them as buttons
    if (node.group === "webauthn" && type !== "submit" && type !== "button") {
      return Slot.Buttons
    }

    if (type === "checkbox") {
      return Slot.Checkboxes
    }

    // Captcha slot is based on group
    if (node.group === "captcha") {
      return Slot.Captcha
    }

    if (type === "submit" || type === "button") {
      return Slot.Buttons
    }

    // Default: inputs slot
    return Slot.Inputs
  }

  return (a: UiNode, b: UiNode) => {
    const sa = slotRank(a)
    const sb = slotRank(b)
    if (sa !== sb) {
      return sa - sb
    }

    const ga = groupRank.get(a.group) ?? unknownGroupRank
    const gb = groupRank.get(b.group) ?? unknownGroupRank
    if (ga !== gb) {
      return ga - gb
    }

    if (a.group === "webauthn" && b.group === "webauthn") {
      const aIsButton = isUiNodeButton(a)
      const bIsButton = isUiNodeButton(b)
      if (aIsButton !== bIsButton) {
        return aIsButton ? 1 : -1
      }
    }

    return 0 // stability handled by wrapper
  }
}

export const defaultNodeSorter = makeUiNodeComparator({
  groupOrder: defaultNodeOrder,
})
