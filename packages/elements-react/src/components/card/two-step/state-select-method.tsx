// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiText,
} from "@ory/client-fetch"
import { useIntl } from "react-intl"
import { useComponents, useNodeSorter, useOryFlow } from "../../../context"
import { kratosMessages } from "../../../util/i18n/generated/kratosMessages"
import {
  GroupedNodes,
  hasSingleSignOnNodes,
  useFunctionalNodes,
  useNodeGroupsWithVisibleNodes,
} from "../../../util/ui"
import { OryForm } from "../../form/form"
import { OryCardValidationMessages } from "../../form/messages"
import { Node } from "../../form/nodes/node"
import { OryFormSsoForm } from "../../form/social"
import { OryCardHeader } from "../header"
import { OryCard, OryCardContent, OryCardFooter } from "./../"
import { AuthMethodList } from "./list-methods"
import { handleAfterFormSubmit } from "./utils"

/**
 * Converts the visible groups of nodes into a format suitable for the
 * AuthMethodOptions
 *
 * @param visibleGroups - The visible groups of nodes
 */
export function toAuthMethodPickerOptions(
  visibleGroups: GroupedNodes,
): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter(
      (group) =>
        !(
          [
            UiNodeGroupEnum.Oidc,
            UiNodeGroupEnum.Saml,
            UiNodeGroupEnum.Default,
            UiNodeGroupEnum.IdentifierFirst,
            UiNodeGroupEnum.Profile,
            UiNodeGroupEnum.Captcha,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )
}

export function SelectMethodForm() {
  const { Form, Card } = useComponents()
  const { flow, flowType, dispatchFormState } = useOryFlow()
  const { ui } = flow

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const visibleGroups = useNodeGroupsWithVisibleNodes(ui.nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)
  const authMethodAdditionalNodes = useFunctionalNodes(ui.nodes)
  // TODO(jonas): rework this (again). The above doesn't work to include the credential nodes and the Captcha nodes behave slightly differently.
  // This is a workaround to include the credential nodes in the auth method blocks.
  const hiddenNodes = ui.nodes.filter(
    (n) =>
      n.group !== UiNodeGroupEnum.Captcha &&
      ((n.attributes.node_type === "input" && n.attributes.type === "hidden") ||
        isUiNodeScriptAttributes(n.attributes)),
  )

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryFormSsoForm />
        {Object.entries(authMethodBlocks).length > 0 ? (
          <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
            <Form.Group>
              <Card.Divider />
              <AuthMethodList
                options={authMethodBlocks}
                setSelectedGroup={(group) =>
                  dispatchFormState({
                    type: "action_select_method",
                    method: group,
                  })
                }
              />
              {authMethodAdditionalNodes.sort(sortNodes).map((node, k) => (
                <Node node={node} key={k} />
              ))}
            </Form.Group>
            {hiddenNodes.map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </OryForm>
        ) : (
          !hasSingleSignOnNodes(ui.nodes) && <NoMethodsMessage />
        )}
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}

function NoMethodsMessage() {
  const intl = useIntl()
  const { Message } = useComponents()

  // This is defined in Ory Kratos as well.
  const noMethods: UiText = {
    id: 5000002,
    text: intl.formatMessage(kratosMessages[5000002]),
    type: "error",
  }

  return (
    <div data-testid={`ory/form/methods/local`}>
      <Message.Root>
        <Message.Content key={noMethods.id} message={noMethods} />
      </Message.Root>
    </div>
  )
}
